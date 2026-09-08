<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoSession;
use App\Models\Event;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PhotoSessionController extends Controller
{
    /**
     * UC-006: Display a listing of photo sessions for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = PhotoSession::with(['event', 'photos', 'result', 'customer'])->latest();

        if ($request->has('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('mode')) {
            $query->where('mode', $request->mode);
        }

        $sessions = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Photo sessions retrieved successfully',
            'data'    => $sessions,
        ]);
    }

    /**
     * Display the specified photo session.
     */
    public function show(string $id): JsonResponse
    {
        $session = PhotoSession::with(['event.package', 'photos', 'result', 'customer'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $session,
        ]);
    }

    /**
     * UC-035: Operator active events list for kiosk selector.
     */
    public function operatorEvents(Request $request): JsonResponse
    {
        $events = Event::with(['package', 'templates.currentVersion.slots'])
            ->where('status', 'active')
            ->latest('event_date')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $events,
        ]);
    }

    /**
     * UC-019: Start an on-site photobooth session.
     */
    public function startOnsiteSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_id'    => 'required|exists:events,id',
            'customer_id' => 'nullable|exists:customers,id',
        ]);

        $event = Event::findOrFail($validated['event_id']);

        $session = PhotoSession::create([
            'event_id'      => $event->id,
            'customer_id'   => $validated['customer_id'] ?? null,
            'session_code'  => 'SES-' . strtoupper(Str::random(6)),
            'session_token' => Str::uuid()->toString(),
            'mode'          => 'onsite',
            'status'        => 'in_progress',
            'started_at'    => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'On-site session started',
            'data'    => $session->load(['event.templates']),
        ], 201);
    }

    /**
     * Public online event info for guest virtual booth.
     */
    public function publicOnlineInfo(string $slug): JsonResponse
    {
        $event = Event::withoutGlobalScope('tenant')
            ->with(['templates.currentVersion.slots', 'tenant.businessProfile'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $event,
        ]);
    }

    /**
     * Start a public online photobooth session.
     */
    public function startOnlineSession(Request $request, string $slug): JsonResponse
    {
        $event = Event::withoutGlobalScope('tenant')->where('slug', $slug)->firstOrFail();

        $session = PhotoSession::create([
            'tenant_id'     => $event->tenant_id,
            'event_id'      => $event->id,
            'session_code'  => 'ONL-' . strtoupper(Str::random(6)),
            'session_token' => Str::uuid()->toString(),
            'mode'          => 'online',
            'status'        => 'in_progress',
            'started_at'    => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Online photobooth session started',
            'data'    => [
                'session_token' => $session->session_token,
                'session'       => $session,
                'event'         => $event->load('templates'),
            ],
        ], 201);
    }

    /**
     * Get live session status.
     */
    public function sessionStatus(string $token): JsonResponse
    {
        $session = PhotoSession::withoutGlobalScope('tenant')
            ->with(['photos', 'result', 'event.templates'])
            ->where('session_token', $token)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $session,
        ]);
    }

    /**
     * Select template for session.
     */
    public function selectTemplate(Request $request, string $token): JsonResponse
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:templates,id',
        ]);

        $session = PhotoSession::withoutGlobalScope('tenant')
            ->where('session_token', $token)
            ->firstOrFail();

        $session->update([
            'status' => 'template_selected',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Template selected',
            'data'    => $session,
        ]);
    }
}
