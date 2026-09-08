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
        $data = $request->validate([
            'tenant_name'           => 'required|string|max:255',
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => ['required', 'confirmed', Password::min(6)],
        ]);

        $tenant = Tenant::create([
            'name'   => $data['tenant_name'],
            'slug'   => Str::slug($data['tenant_name']) . '-' . Str::lower(Str::random(5)),
            'status' => 'active',
        ]);

        $user = User::create([
            'tenant_id' => $tenant->id,
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'status'    => 'active',
        ]);

        $user->assignRole('tenant_admin');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Tenant registered successfully',
            'data'    => [
                'token'  => $token,
                'user'   => $user->load(['roles', 'tenant']),
                'tenant' => $tenant,
            ],
        ], 201);
    }

    /**
     * UC-002: Login
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'The provided credentials do not match our records.',
            ], 422);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your account is inactive or suspended.',
            ], 403);
        }

        if ($user->tenant_id && $user->tenant && $user->tenant->status !== 'active') {
            return response()->json([
                'message' => 'Your tenant account is inactive or suspended.',
            ], 403);
        }

        $user->update(['last_login_at' => now()]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data'    => [
                'token'  => $token,
                'user'   => $user->load(['roles', 'tenant']),
                'tenant' => $user->tenant,
            ],
        ]);
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
