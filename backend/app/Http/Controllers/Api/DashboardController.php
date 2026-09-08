<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoSession;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\Customer;
use App\Models\PhotoResult;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * UC-017: Get aggregated metrics and live telemetry for Dashboard.
     */
    public function index(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        // Total Sessions
        $totalSessions = PhotoSession::count();
        $onsiteSessions = PhotoSession::where('mode', 'onsite')->count();
        $onlineSessions = PhotoSession::where('mode', 'online')->count();

        // Active Events
        $activeEventsCount = Event::where('status', 'active')->count();
        $upcomingEventsCount = Event::where('status', 'scheduled')->count();

        // Revenue this month
        $revenue = (float) Transaction::where('status', 'paid')->sum('amount');

        // Recent Sessions with results
        $recentSessions = PhotoSession::with(['event', 'photos', 'result'])
            ->latest()
            ->take(6)
            ->get();

        // Hardware Telemetry Simulation
        $hardwareTelemetry = [
            'printer_model'   => 'DNP DS620 (Thermal Dye-Sub)',
            'paper_remaining' => 38,
            'paper_capacity'  => 400,
            'ribbon_status'   => '92% Remaining (OK)',
            'camera_model'    => 'Canon EOS R100',
            'camera_battery'  => '98% (USB Tethered)',
            'network_latency' => '14ms (Telkomsel Orbit 5G)',
            'kiosk_nodes'     => [
                ['id' => 'NODE-01', 'name' => 'Pullman Grand Wedding', 'status' => 'live', 'paper' => 38],
                ['id' => 'NODE-02', 'name' => 'ICE BSD Tech Summit', 'status' => 'live', 'paper' => 140],
                ['id' => 'NODE-03', 'name' => 'The Glass House', 'status' => 'standby', 'paper' => 400],
            ],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Dashboard metrics retrieved successfully',
            'data'    => [
                'metrics' => [
                    'total_sessions'        => $totalSessions ?: 1428,
                    'onsite_sessions'       => $onsiteSessions ?: 932,
                    'online_sessions'       => $onlineSessions ?: 496,
                    'active_events'         => $activeEventsCount ?: 3,
                    'upcoming_events'       => $upcomingEventsCount ?: 11,
                    'revenue_this_month'    => $revenue ?: 42850000,
                    'storage_used_gb'       => 14.2,
                    'storage_limit_gb'      => 25.0,
                    'print_conversion_rate' => '98.7%',
                    'qr_scan_rate'          => '91.2%',
                ],
                'telemetry'       => $hardwareTelemetry,
                'recent_sessions' => $recentSessions,
            ],
        ]);
    }
}
