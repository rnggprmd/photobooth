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

    /**
     * Store a newly created transaction / invoice.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name'  => 'nullable|string|max:255',
            'event_name'     => 'nullable|string|max:255',
            'amount'         => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'status'         => 'nullable|string|in:paid,pending,refunded',
            'due_at'         => 'nullable|string',
            'notes'          => 'nullable|string',
        ]);

        $invoiceNumber = 'INV-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));

        $transaction = Transaction::create([
            'tenant_id'        => auth()->user()->tenant_id ?? 1,
            'type'             => 'invoice',
            'invoice_number'   => $invoiceNumber,
            'amount'           => $validated['amount'],
            'currency'         => 'IDR',
            'status'           => $validated['status'] ?? 'pending',
            'transaction_date' => now(),
            'due_at'           => !empty($validated['due_at']) ? $validated['due_at'] : now()->addDays(7),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaction created successfully',
            'data'    => $transaction,
        ], 201);
    }
}

