<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers for the current tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Customer::withCount('photoSessions')->latest();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Customers retrieved successfully',
            'data'    => $customers,
        ]);
    }

    /**
     * Store a newly created customer.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'nullable|email|max:255',
            'phone'  => 'nullable|string|max:30',
            'gender' => 'nullable|in:male,female,other',
            'notes'  => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data'    => $customer,
        ], 201);
    }

    /**
     * Display the specified customer.
     */
    public function show(string $id): JsonResponse
    {
        $customer = Customer::with(['photoSessions.event', 'photoSessions.result'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $customer,
        ]);
    }

    /**
     * Update the specified customer.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name'   => 'sometimes|required|string|max:255',
            'email'  => 'nullable|email|max:255',
            'phone'  => 'nullable|string|max:30',
            'gender' => 'nullable|in:male,female,other',
            'notes'  => 'nullable|string',
        ]);

        $customer->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data'    => $customer,
        ]);
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(string $id): JsonResponse
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully',
            'data'    => null,
        ]);
    }
}
