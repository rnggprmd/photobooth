<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BusinessProfileController extends Controller
{
    /**
     * UC-007: Display the business profile of the current tenant.
     */
    public function show(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $profile = BusinessProfile::firstOrCreate(
            ['tenant_id' => $tenantId],
            [
                'business_name' => auth()->user()->tenant->name ?? 'Lumina Studio',
                'email'         => auth()->user()->email,
            ]
        );

        return response()->json([
            'success' => true,
            'data'    => $profile,
        ]);
    }

    /**
     * UC-007: Update the business profile.
     */
    public function update(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $profile = BusinessProfile::where('tenant_id', $tenantId)->firstOrFail();

        $validated = $request->validate([
            'business_name' => 'sometimes|required|string|max:255',
            'description'   => 'nullable|string',
            'email'         => 'nullable|email|max:255',
            'phone'         => 'nullable|string|max:30',
            'address'       => 'nullable|string',
            'branding_json' => 'nullable|array',
        ]);

        $profile->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil bisnis berhasil diperbarui',
            'data'    => $profile,
        ]);
    }
}
