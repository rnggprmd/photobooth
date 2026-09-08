<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\TenantSubscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    /**
     * UC-005: Display a listing of tenants (Super Admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tenant::with(['businessProfile', 'subscriptions.plan', 'users'])->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $tenants = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Tenants retrieved successfully',
            'data'    => $tenants,
        ]);
    }

    /**
     * Store a newly created tenant.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'admin_name' => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6',
            'plan_id'    => 'nullable|exists:subscription_plans,id',
            'status'     => 'nullable|in:active,suspended',
        ]);

        $tenant = Tenant::create([
            'name'   => $validated['name'],
            'slug'   => Str::slug($validated['name']) . '-' . Str::lower(Str::random(5)),
            'status' => $validated['status'] ?? 'active',
        ]);

        $admin = User::create([
            'tenant_id' => $tenant->id,
            'name'      => $validated['admin_name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'status'    => 'active',
        ]);
        $admin->assignRole('tenant_admin');

        if (!empty($validated['plan_id'])) {
            TenantSubscription::create([
                'tenant_id'  => $tenant->id,
                'plan_id'    => $validated['plan_id'],
                'status'     => 'active',
                'started_at' => now(),
                'ends_at'    => now()->addDays(30),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tenant registered successfully',
            'data'    => $tenant->load(['users', 'subscriptions.plan']),
        ], 201);
    }

    /**
     * Display the specified tenant.
     */
    public function show(string $id): JsonResponse
    {
        $tenant = Tenant::with(['businessProfile', 'subscriptions.plan', 'users', 'packages', 'events'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $tenant,
        ]);
    }

    /**
     * Update the specified tenant.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);

        $validated = $request->validate([
            'name'   => 'sometimes|required|string|max:255',
            'status' => 'nullable|in:active,suspended',
        ]);

        $tenant->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tenant updated successfully',
            'data'    => $tenant,
        ]);
    }

    /**
     * Update tenant status.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:active,suspended',
        ]);

        $tenant = Tenant::findOrFail($id);
        $tenant->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Tenant status updated to ' . $validated['status'],
            'data'    => $tenant,
        ]);
    }

    /**
     * Remove the specified tenant.
     */
    public function destroy(string $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tenant deleted successfully',
            'data'    => null,
        ]);
    }
}
