<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * UC-001: Register — membuat akun user dan tenant baru.
     */
    public function register(Request $request): JsonResponse
    {
        // TODO: Implement register logic
        // 1. Validate: name, email, password, business_name
        // 2. Create Tenant
        // 3. Create User with tenant_id
        // 4. Assign role 'tenant_admin'
        // 5. Create BusinessProfile stub
        // 6. Create initial TenantSubscription (free/trial)
        // 7. Return token
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    /**
     * UC-002: Login
     */
    public function login(Request $request): JsonResponse
    {
        // TODO: Implement login logic
        // 1. Validate: email, password
        // 2. Check user exists and status is active
        // 3. Verify password
        // 4. Update last_login_at
        // 5. Issue Sanctum token
        // 6. Return token + user + tenant info
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    /**
     * UC-003: Logout
     */
    public function logout(Request $request): JsonResponse
    {
        // TODO: Revoke current token
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * UC-004: Forgot Password
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        // TODO: Send password reset link
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    /**
     * UC-004: Reset Password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        // TODO: Reset password using token
        return response()->json(['message' => 'Not implemented yet.'], 501);
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user'   => $request->user()->load(['tenant', 'roles']),
        ]);
    }
}
