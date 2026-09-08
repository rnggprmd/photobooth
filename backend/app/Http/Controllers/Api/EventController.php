<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of events for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::with(['package', 'operators', 'templates.currentVersion.slots'])->latest('event_date');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('location', 'like', '%' . $request->search . '%');
            });
        }

        $events = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Events retrieved successfully',
            'data'    => $events,
        ]);
    }

    /**
     * Store a newly created event.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'package_id'   => 'nullable|exists:packages,id',
            'description'  => 'nullable|string',
            'event_date'   => 'required|date',
            'start_time'   => 'nullable|string',
            'end_time'     => 'nullable|string',
            'location'     => 'nullable|string|max:255',
            'status'       => 'nullable|in:draft,active,completed,cancelled',
            'operator_ids' => 'nullable|array',
            'operator_ids.*' => 'exists:users,id',
            'template_ids' => 'nullable|array',
            'template_ids.*' => 'exists:templates,id',
        ]);

        $slug = Str::slug($validated['name']) . '-' . Str::lower(Str::random(5));

        $event = Event::create([
            'package_id'   => $validated['package_id'] ?? null,
            'name'         => $validated['name'],
            'slug'         => $slug,
            'description'  => $validated['description'] ?? null,
            'event_date'   => $validated['event_date'],
            'start_time'   => $validated['start_time'] ?? '10:00:00',
            'end_time'     => $validated['end_time'] ?? '22:00:00',
            'location'     => $validated['location'] ?? null,
            'status'       => $validated['status'] ?? 'active',
        ]);

        if (!empty($validated['operator_ids'])) {
            $event->operators()->sync($validated['operator_ids']);
        }

        if (!empty($validated['template_ids'])) {
            $event->templates()->sync($validated['template_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data'    => $event->load(['package', 'operators', 'templates']),
        ], 201);
    }

    /**
     * Display the specified event.
     */
    public function show(string $id): JsonResponse
    {
        $event = Event::with(['package', 'operators', 'templates.currentVersion.slots', 'photoSessions.result'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $event,
        ]);
    }

    /**
     * Update the specified event.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'name'         => 'sometimes|required|string|max:255',
            'package_id'   => 'nullable|exists:packages,id',
            'description'  => 'nullable|string',
            'event_date'   => 'sometimes|required|date',
            'start_time'   => 'nullable|string',
            'end_time'     => 'nullable|string',
            'location'     => 'nullable|string|max:255',
            'status'       => 'nullable|in:draft,active,completed,cancelled',
            'operator_ids' => 'nullable|array',
            'template_ids' => 'nullable|array',
        ]);

        $event->update($validated);

        if (isset($validated['operator_ids'])) {
            $event->operators()->sync($validated['operator_ids']);
        }

        if (isset($validated['template_ids'])) {
            $event->templates()->sync($validated['template_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data'    => $event->load(['package', 'operators', 'templates']),
        ]);
    }

    /**
     * Update event status.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,active,completed,cancelled',
        ]);

        $event = Event::findOrFail($id);
        $event->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Event status updated',
            'data'    => $event,
        ]);
    }

    /**
     * Assign templates to event.
     */
    public function assignTemplates(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'template_ids'   => 'required|array',
            'template_ids.*' => 'exists:templates,id',
        ]);

        $event = Event::findOrFail($id);
        $event->templates()->sync($validated['template_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Templates assigned to event successfully',
            'data'    => $event->load('templates'),
        ]);
    }

    /**
     * Assign operators to event.
     */
    public function assignOperators(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'operator_ids'   => 'required|array',
            'operator_ids.*' => 'exists:users,id',
        ]);

        $event = Event::findOrFail($id);
        $event->operators()->sync($validated['operator_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Operators assigned to event successfully',
            'data'    => $event->load('operators'),
        ]);
    }

    /**
     * Remove operator from event.
     */
    public function removeOperator(string $id, string $userId): JsonResponse
    {
        $event = Event::findOrFail($id);
        $event->operators()->detach($userId);

        return response()->json([
            'success' => true,
            'message' => 'Operator removed from event',
            'data'    => $event->load('operators'),
        ]);
    }

    /**
     * Remove the specified event.
     */
    public function destroy(string $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully',
            'data'    => null,
        ]);
    }
}
