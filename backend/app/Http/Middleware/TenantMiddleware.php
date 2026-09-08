<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * TenantMiddleware
 *
 * Ensures the authenticated user is associated with a valid, active tenant.
 * Blocks access for Super Admin routes that bypass tenant context.
 */
class TenantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Super Admin does not belong to a specific tenant
        if ($user->hasRole('super_admin')) {
            return $next($request);
        }

        if (! $user->tenant_id) {
            return response()->json([
                'message' => 'You are not associated with any tenant.',
            ], 403);
        }

        $tenant = $user->tenant;

        if (! $tenant) {
            return response()->json([
                'message' => 'Tenant not found.',
            ], 403);
        }

        if ($tenant->status !== 'active') {
            return response()->json([
                'message' => 'Your tenant account is inactive or suspended.',
            ], 403);
        }

        // Share tenant context for downstream usage
        app()->instance('current_tenant', $tenant);

        return $next($request);
    }
}
