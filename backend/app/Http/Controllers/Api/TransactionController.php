<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Transaction::with(['event', 'customer', 'payments'])->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('transaction_code', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $transactions = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Transactions retrieved successfully',
            'data'    => $transactions,
        ]);
    }

    /**
     * Display the specified transaction.
     */
    public function show(string $id): JsonResponse
    {
        $transaction = Transaction::with(['event', 'customer', 'payments', 'tenant.businessProfile'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $transaction,
        ]);
    }
}
