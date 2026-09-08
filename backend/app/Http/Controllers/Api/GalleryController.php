<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoResult;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    /**
     * UC-028: Display gallery of composite photo results for current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PhotoResult::with(['photoSession.event', 'photoSession.customer', 'compositeMedia', 'qrMedia'])->latest();

        if ($request->has('event_id')) {
            $query->whereHas('photoSession', function ($q) use ($request) {
                $q->where('event_id', $request->event_id);
            });
        }

        $results = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Gallery photo results retrieved successfully',
            'data'    => $results,
        ]);
    }

    /**
     * Display the specified photo result.
     */
    public function show(string $id): JsonResponse
    {
        $result = PhotoResult::with(['photoSession.event', 'photoSession.photos', 'compositeMedia', 'qrMedia'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $result,
        ]);
    }

    /**
     * Delete a photo result.
     */
    public function destroy(string $id): JsonResponse
    {
        $result = PhotoResult::findOrFail($id);
        $result->delete();

        return response()->json([
            'success' => true,
            'message' => 'Photo result deleted successfully',
            'data'    => null,
        ]);
    }
}
