<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of staff and operators for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $query = User::with('roles')
            ->where('tenant_id', $tenantId)
            ->latest();

        if ($request->has('role')) {
            $role = $request->role;
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        $users = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data'    => $users,
        ]);
    }

    /**
     * Store a newly created operator/user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone'    => 'nullable|string|max:30',
            'role'     => 'nullable|in:operator,management,tenant_admin',
        ]);

        $tenantId = auth()->user()->tenant_id;

        $user = User::create([
            'tenant_id' => $tenantId,
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'status'    => 'active',
        ]);

        $roleName = $validated['role'] ?? 'operator';
        $user->assignRole($roleName);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data'    => $user->load('roles'),
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(string $id): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $user = User::with('roles')->where('tenant_id', $tenantId)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $user = User::where('tenant_id', $tenantId)->findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'phone'    => 'nullable|string|max:30',
            'status'   => 'nullable|in:active,inactive',
            'password' => 'nullable|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data'    => $user->load('roles'),
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(string $id): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $user = User::where('tenant_id', $tenantId)->findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
            'data'    => null,
        ]);
    }
}
