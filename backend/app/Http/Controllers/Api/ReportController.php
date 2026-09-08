<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoSession;
use App\Models\Event;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    /**
     * UC-018: Sessions Report with volume breakdown and hardware metrics.
     */
    public function sessions(Request $request): JsonResponse
    {
        $range = $request->query('range', 'today');

        $hourlyVolume = [
            ['time' => '09:00', 'onsite' => 18, 'online' => 8, 'total' => 26],
            ['time' => '11:00', 'onsite' => 26, 'online' => 12, 'total' => 38],
            ['time' => '13:00', 'onsite' => 58, 'online' => 24, 'total' => 82],
            ['time' => '15:00', 'onsite' => 40, 'online' => 19, 'total' => 59],
            ['time' => '17:00', 'onsite' => 78, 'online' => 32, 'total' => 110],
            ['time' => '19:00', 'onsite' => 92, 'online' => 41, 'total' => 133, 'peak' => true],
            ['time' => '21:00', 'onsite' => 36, 'online' => 22, 'total' => 58],
        ];

        $popularFormats = [
            ['name' => '4R Strip (2x6" 3-Frame)', 'count' => 298, 'percentage' => 54],
            ['name' => '4R Single Postcard (4x6")', 'count' => 143, 'percentage' => 26],
            ['name' => '2R Mini Bookmark Cut', 'count' => 77, 'percentage' => 14],
            ['name' => 'Cyber Glitch Digital (QR)', 'count' => 34, 'percentage' => 6],
        ];

        $incidents = [
            [
                'id'       => 'inc-1',
                'waktu'    => '18:42 WIB',
                'lokasi'   => 'Pullman Grand Wedding',
                'operator' => 'Aris Kurniawan',
                'kategori' => 'Hardware',
                'status'   => 'Resolved',
                'tindakan' => 'Paper jam pada tray DNP DS620 teratasi, pembersihan roller, uji cetak berhasil.',
            ],
            [
                'id'       => 'inc-2',
                'waktu'    => '17:15 WIB',
                'lokasi'   => 'ICE BSD Tech Summit',
                'operator' => 'Dika Pratama',
                'kategori' => 'Jaringan',
                'status'   => 'Resolved',
                'tindakan' => 'Failover otomatis switch ke 4G backup saat kabel LAN venue sempat drop 18 detik.',
            ],
            [
                'id'       => 'inc-3',
                'waktu'    => '16:30 WIB',
                'lokasi'   => 'The Glass House Standby',
                'operator' => 'Fauzan H.',
                'kategori' => 'Setup Sesi',
                'status'   => 'Resolved',
                'tindakan' => 'Penggantian 1 roll baru DNP DS620 (400 lembar) dan kalibrasi white balance kamera.',
            ],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Sessions report retrieved',
            'data'    => [
                'range'           => $range,
                'total_sessions'  => 496,
                'onsite_sessions' => 312,
                'online_sessions' => 184,
                'paper_consumed'  => 552,
                'paper_stock'     => 3648,
                'quota_percent'   => 82,
                'uptime'          => '99.8%',
                'avg_latency_ms'  => 18,
                'hourly_volume'   => $hourlyVolume,
                'popular_formats' => $popularFormats,
                'incidents'       => $incidents,
            ],
        ]);
    }

    /**
     * Events performance report.
     */
    public function events(Request $request): JsonResponse
    {
        $events = Event::withCount('photoSessions')
            ->latest('event_date')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $events,
        ]);
    }

    /**
     * Financial transactions report.
     */
    public function transactions(Request $request): JsonResponse
    {
        $transactions = Transaction::latest()->take(20)->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'total_revenue' => Transaction::where('status', 'paid')->sum('amount'),
                'transactions'  => $transactions,
            ],
        ]);
    }

    /**
     * Business & SaaS quota utilization report.
     */
    public function business(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'active_subscription' => 'Pro Business',
                'sessions_quota'      => ['used' => 1640, 'total' => 2000],
                'storage_quota'       => ['used_gb' => 14.2, 'total_gb' => 25.0],
                'active_booth_nodes'  => 3,
            ],
        ]);
    }
}
