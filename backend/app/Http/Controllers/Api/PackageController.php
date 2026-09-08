<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PackageController extends Controller
{
    /**
     * Display a listing of packages for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Package::with(['templates'])->latest();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $packages = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Packages retrieved successfully',
            'data'    => $packages,
        ]);
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'price'            => 'required|numeric|min:0',
            'duration_minutes' => 'required|integer|min:1',
            'max_sessions'     => 'nullable|integer|min:1',
            'status'           => 'nullable|in:active,inactive',
            'template_ids'     => 'nullable|array',
            'template_ids.*'   => 'exists:templates,id',
        ]);

        $package = Package::create([
            'name'             => $validated['name'],
            'description'      => $validated['description'] ?? null,
            'price'            => $validated['price'],
            'duration_minutes' => $validated['duration_minutes'],
            'max_sessions'     => $validated['max_sessions'] ?? 300,
            'status'           => $validated['status'] ?? 'active',
        ]);

        if (!empty($validated['template_ids'])) {
            $package->templates()->sync($validated['template_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Package created successfully',
            'data'    => $package->load('templates'),
        ], 201);
    }

    /**
     * Display the specified package.
     */
    public function show(string $id): JsonResponse
    {
        $package = Package::with(['templates', 'events'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $package,
        ]);
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $package = Package::findOrFail($id);

        $validated = $request->validate([
            'name'             => 'sometimes|required|string|max:255',
            'description'      => 'nullable|string',
            'price'            => 'sometimes|required|numeric|min:0',
            'duration_minutes' => 'sometimes|required|integer|min:1',
            'max_sessions'     => 'nullable|integer|min:1',
            'status'           => 'nullable|in:active,inactive',
            'template_ids'     => 'nullable|array',
            'template_ids.*'   => 'exists:templates,id',
        ]);

        $package->update($validated);

        if (isset($validated['template_ids'])) {
            $package->templates()->sync($validated['template_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Package updated successfully',
            'data'    => $package->load('templates'),
        ]);
    }

    /**
     * Remove the specified package.
     */
    public function destroy(string $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $package->delete();

        return response()->json([
            'success' => true,
            'message' => 'Package deleted successfully',
            'data'    => null,
        ]);
    }
}
