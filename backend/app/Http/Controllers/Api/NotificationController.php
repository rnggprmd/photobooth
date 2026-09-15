<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Display a listing of notifications for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id ?? null;

        $query = Notification::query()->latest();
        if ($tenantId) {
            $query->where('tenant_id', $tenantId);
        }

        $notifications = $query->take(20)->get();

        // Seed initial notifications if none exist yet
        if ($notifications->isEmpty() && $tenantId) {
            $initial = [
                [
                    'tenant_id' => $tenantId,
                    'user_id' => auth()->id(),
                    'type' => 'printer_warning',
                    'channel' => 'in_app',
                    'title' => 'Peringatan Stok Kertas Rendah',
                    'message' => 'Sisa kertas DNP DS620 di Kiosk 01 tersisa 38 lembar. Siapkan roll cadangan.',
                    'status' => 'unread',
                    'created_at' => now()->subMinutes(12),
                ],
                [
                    'tenant_id' => $tenantId,
                    'user_id' => auth()->id(),
                    'type' => 'payment_success',
                    'channel' => 'in_app',
                    'title' => 'Pembayaran Invoice Berhasil',
                    'message' => 'Tagihan INV-2026-0982 senilai Rp 4.750.000 (Kevin & Astrid) telah lunas via BCA VA.',
                    'status' => 'unread',
                    'created_at' => now()->subHours(1),
                ],
                [
                    'tenant_id' => $tenantId,
                    'user_id' => auth()->id(),
                    'type' => 'session_complete',
                    'channel' => 'in_app',
                    'title' => 'Sesi Foto Baru Selesai',
                    'message' => 'Sesi #SES-8821-0492 berhasil dicetak dan QR code siap dibagikan ke pengunjung.',
                    'status' => 'read',
                    'read_at' => now()->subHours(2),
                    'created_at' => now()->subHours(2),
                ],
                [
                    'tenant_id' => $tenantId,
                    'user_id' => auth()->id(),
                    'type' => 'system_alert',
                    'channel' => 'in_app',
                    'title' => 'Failover Switch 4G Sukses',
                    'message' => 'Koneksi Kiosk Terminal TS-B dialihkan ke backup modem 4G LTE tanpa kendala operasional.',
                    'status' => 'read',
                    'read_at' => now()->subHours(4),
                    'created_at' => now()->subHours(4),
                ],
            ];

            foreach ($initial as $item) {
                Notification::create($item);
            }

            $notifications = Notification::where('tenant_id', $tenantId)->latest()->get();
        }

        $unreadCount = $notifications->where('status', 'unread')->count();

        return response()->json([
            'success' => true,
            'message' => 'Notifications retrieved successfully',
            'data' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark a single notification as read.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'data' => $notification,
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id ?? null;
        $query = Notification::where('status', 'unread');
        if ($tenantId) {
            $query->where('tenant_id', $tenantId);
        }
        $query->update([
            'status' => 'read',
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Remove the specified notification.
     */
    public function destroy(string $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted successfully',
        ]);
    }
}
