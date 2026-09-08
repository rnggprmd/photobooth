<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\TenantSubscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class SubscriptionPlanController extends Controller
{
    /**
     * UC-006: Display a listing of all subscription plans (Super Admin).
     */
    public function index(Request $request): JsonResponse
    {
        $plans = SubscriptionPlan::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Subscription plans retrieved successfully',
            'data'    => $plans,
        ]);
    }

    /**
     * Store a newly created subscription plan.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'price'          => 'required|numeric|min:0',
            'billing_cycle'  => 'required|in:monthly,yearly',
            'duration_days'  => 'required|integer|min:1',
            'max_events'     => 'required|integer|min:1',
            'max_storage_gb' => 'required|numeric|min:1',
            'features_json'  => 'nullable|array',
            'is_active'      => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $plan = SubscriptionPlan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan created successfully',
            'data'    => $plan,
        ], 201);
    }

    /**
     * Display the specified subscription plan.
     */
    public function show(string $id): JsonResponse
    {
        $plan = SubscriptionPlan::findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $plan,
        ]);
    }

    /**
     * Update the specified subscription plan.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'price'          => 'sometimes|required|numeric|min:0',
            'billing_cycle'  => 'sometimes|required|in:monthly,yearly',
            'duration_days'  => 'sometimes|required|integer|min:1',
            'max_events'     => 'sometimes|required|integer|min:1',
            'max_storage_gb' => 'sometimes|required|numeric|min:1',
            'features_json'  => 'nullable|array',
            'is_active'      => 'boolean',
        ]);

        $plan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan updated successfully',
            'data'    => $plan,
        ]);
    }

    /**
     * Remove the specified plan.
     */
    public function destroy(string $id): JsonResponse
    {
        $plan = SubscriptionPlan::findOrFail($id);
        $plan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan deleted successfully',
            'data'    => null,
        ]);
    }

    /**
     * UC-016: Get available plans for tenant viewing.
     */
    public function availablePlans(): JsonResponse
    {
        $plans = SubscriptionPlan::where('status', 'active')->get();

        return response()->json([
            'success' => true,
            'data'    => $plans,
        ]);
    }

    /**
     * UC-016: Get current tenant subscription.
     */
    public function tenantSubscription(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $sub = TenantSubscription::with('plan')
            ->where('tenant_id', $tenantId)
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data'    => $sub,
        ]);
    }

    /**
     * UC-016: Tenant selects / upgrades subscription plan.
     */
    public function selectPlan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan_id'       => 'required|exists:subscription_plans,id',
            'billing_cycle' => 'nullable|in:monthly,yearly',
        ]);

        $tenantId = auth()->user()->tenant_id;
        $plan = SubscriptionPlan::findOrFail($validated['plan_id']);

        $durationDays = $validated['billing_cycle'] === 'yearly' ? 365 : 30;

        $sub = TenantSubscription::updateOrCreate(
            ['tenant_id' => $tenantId],
            [
                'plan_id'                  => $plan->id,
                'status'                   => 'active',
                'started_at'               => now(),
                'ends_at'                  => now()->addDays($durationDays),
                'external_subscription_id' => 'SUB-' . strtoupper(Str::random(10)),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Langganan berhasil diperbarui ke paket ' . $plan->name,
            'data'    => $sub->load('plan'),
        ]);
    }
}
