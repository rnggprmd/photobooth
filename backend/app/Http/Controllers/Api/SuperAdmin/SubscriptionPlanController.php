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
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'billing_period' => 'nullable|in:monthly,yearly',
            'billing_cycle'  => 'nullable|in:monthly,yearly',
            'max_events'     => 'nullable|integer|min:0',
            'max_sessions'   => 'nullable|integer|min:0',
            'max_templates'  => 'nullable|integer|min:0',
            'max_storage_mb' => 'nullable|numeric|min:0',
            'max_storage_gb' => 'nullable|numeric|min:0',
            'max_operators'  => 'nullable|integer|min:0',
            'features_json'  => 'nullable|array',
            'status'         => 'nullable|in:active,inactive',
            'is_active'      => 'nullable|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        if (isset($validated['billing_cycle']) && !isset($validated['billing_period'])) {
            $validated['billing_period'] = $validated['billing_cycle'];
        }
        if (isset($validated['max_storage_gb']) && !isset($validated['max_storage_mb'])) {
            $validated['max_storage_mb'] = (int) ($validated['max_storage_gb'] * 1024);
        }
        if (isset($validated['is_active']) && !isset($validated['status'])) {
            $validated['status'] = $validated['is_active'] ? 'active' : 'inactive';
        }

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
            'description'    => 'nullable|string',
            'price'          => 'sometimes|required|numeric|min:0',
            'billing_period' => 'nullable|in:monthly,yearly',
            'billing_cycle'  => 'nullable|in:monthly,yearly',
            'max_events'     => 'nullable|integer|min:0',
            'max_sessions'   => 'nullable|integer|min:0',
            'max_templates'  => 'nullable|integer|min:0',
            'max_storage_mb' => 'nullable|numeric|min:0',
            'max_storage_gb' => 'nullable|numeric|min:0',
            'max_operators'  => 'nullable|integer|min:0',
            'features_json'  => 'nullable|array',
            'status'         => 'nullable|in:active,inactive',
            'is_active'      => 'nullable|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        if (isset($validated['billing_cycle']) && !isset($validated['billing_period'])) {
            $validated['billing_period'] = $validated['billing_cycle'];
        }
        if (isset($validated['max_storage_gb']) && !isset($validated['max_storage_mb'])) {
            $validated['max_storage_mb'] = (int) ($validated['max_storage_gb'] * 1024);
        }
        if (isset($validated['is_active']) && !isset($validated['status'])) {
            $validated['status'] = $validated['is_active'] ? 'active' : 'inactive';
        }

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
