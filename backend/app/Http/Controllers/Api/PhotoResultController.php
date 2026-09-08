<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PhotoResult;
use App\Models\PhotoSession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PhotoResultController extends Controller
{
    /**
     * UC-027: Public view of photo result via QR code token scan.
     */
    public function publicView(string $result_token): JsonResponse
    {
        $result = PhotoResult::withoutGlobalScope('tenant')
            ->with(['photoSession.event.package', 'photoSession.event.tenant.businessProfile', 'compositeMedia', 'qrMedia'])
            ->where('result_token', $result_token)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $result,
        ]);
    }

    /**
     * UC-024: Generate photo composite result.
     */
    public function generate(Request $request, string $token): JsonResponse
    {
        $session = PhotoSession::withoutGlobalScope('tenant')
            ->where('session_token', $token)
            ->firstOrFail();

        $resultToken = 'RES-' . strtoupper(Str::random(8));

        $result = PhotoResult::create([
            'photo_session_id' => $session->id,
            'result_token'     => $resultToken,
            'print_count'      => 0,
        ]);

        $session->update(['status' => 'completed', 'completed_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Composite photo generated successfully',
            'data'    => $result,
        ]);
    }

    /**
     * UC-025: Get session result by session token.
     */
    public function sessionResult(string $token): JsonResponse
    {
        $session = PhotoSession::withoutGlobalScope('tenant')
            ->with(['result.compositeMedia', 'result.qrMedia'])
            ->where('session_token', $token)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $session->result,
        ]);
    }
}
