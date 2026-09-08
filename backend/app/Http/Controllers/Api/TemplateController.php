<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\TemplateVersion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TemplateController extends Controller
{
    /**
     * Display a listing of templates for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Template::with(['currentVersion.slots', 'previewMedia'])->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('paper_size')) {
            $query->where('paper_size', $request->paper_size);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $templates = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Templates retrieved successfully',
            'data'    => $templates,
        ]);
    }

    /**
     * Store a newly created template.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'paper_size'    => 'required|string|in:4R,2R,5R,A4,Custom',
            'orientation'   => 'required|in:portrait,landscape',
            'canvas_width'  => 'required|integer|min:100',
            'canvas_height' => 'required|integer|min:100',
            'status'        => 'nullable|in:draft,active,archived',
            'slots'         => 'nullable|array',
        ]);

        $template = Template::create([
            'name'          => $validated['name'],
            'paper_size'    => $validated['paper_size'],
            'orientation'   => $validated['orientation'],
            'canvas_width'  => $validated['canvas_width'],
            'canvas_height' => $validated['canvas_height'],
            'status'        => $validated['status'] ?? 'active',
        ]);

        $version = TemplateVersion::create([
            'template_id'    => $template->id,
            'version_number' => 1,
            'canvas_width'   => $validated['canvas_width'],
            'canvas_height'  => $validated['canvas_height'],
            'status'         => 'published',
            'created_by'     => auth()->id(),
        ]);

        $template->update(['current_version_id' => $version->id]);

        if (!empty($validated['slots'])) {
            foreach ($validated['slots'] as $order => $slotData) {
                $version->slots()->create([
                    'slot_order' => $order + 1,
                    'slot_key'   => $slotData['key'] ?? "slot_" . ($order + 1),
                    'position_x' => $slotData['x'] ?? 0,
                    'position_y' => $slotData['y'] ?? 0,
                    'width'      => $slotData['w'] ?? 400,
                    'height'     => $slotData['h'] ?? 300,
                    'rotation'   => $slotData['rotation'] ?? 0,
                    'crop_mode'  => $slotData['crop_mode'] ?? 'cover',
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Template created successfully',
            'data'    => $template->load('currentVersion.slots'),
        ], 201);
    }

    /**
     * Display the specified template.
     */
    public function show(string $id): JsonResponse
    {
        $template = Template::with(['currentVersion.slots', 'previewMedia', 'packages'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $template,
        ]);
    }

    /**
     * Update the specified template.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $template = Template::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'status'      => 'nullable|in:draft,active,archived',
            'orientation' => 'nullable|in:portrait,landscape',
        ]);

        $template->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Template updated successfully',
            'data'    => $template->load('currentVersion.slots'),
        ]);
    }

    /**
     * Update template status.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,active,archived',
        ]);

        $template = Template::findOrFail($id);
        $template->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Template status updated',
            'data'    => $template,
        ]);
    }

    /**
     * Remove the specified template.
     */
    public function destroy(string $id): JsonResponse
    {
        $template = Template::findOrFail($id);
        $template->delete();

        return response()->json([
            'success' => true,
            'message' => 'Template deleted successfully',
            'data'    => null,
        ]);
    }
}
