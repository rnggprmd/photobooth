<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * CheckSubscription
 *
 * Ensures the tenant has an active subscription.
 * Can be applied to routes that require an active subscription.
 */
class CheckSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->hasRole('super_admin')) {
            return $next($request);
        }

        $tenant = $user->tenant;

        if (! $tenant) {
            return response()->json(['message' => 'Tenant not found.'], 403);
        }

        $activeSubscription = $tenant->activeSubscription;

        if (! $activeSubscription || ! $activeSubscription->isActive()) {
            return response()->json([
                'message' => 'Your subscription has expired or is inactive. Please renew to continue.',
                'code'    => 'SUBSCRIPTION_REQUIRED',
            ], 403);
        }

        return $next($request);
    }
}
