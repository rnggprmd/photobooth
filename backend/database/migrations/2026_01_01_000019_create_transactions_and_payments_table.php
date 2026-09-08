<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('package_id')->nullable()->constrained('packages')->nullOnDelete();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->foreignId('tenant_subscription_id')->nullable()->constrained('tenant_subscriptions')->nullOnDelete();
            $table->string('type'); // package_purchase, subscription
            $table->string('invoice_number')->unique();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 10)->default('IDR');
            $table->string('status')->default('pending'); // pending, paid, failed, expired, refunded
            $table->timestamp('transaction_date')->useCurrent();
            $table->timestamp('due_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'customer_id']);
            $table->index(['invoice_number']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->cascadeOnDelete();
            $table->string('provider')->nullable(); // midtrans, xendit, etc.
            $table->string('method')->nullable(); // va, qris, ewallet, transfer
            $table->decimal('amount', 12, 2);
            $table->string('external_reference')->nullable(); // reference from payment gateway
            $table->string('status')->default('pending'); // pending, paid, failed, expired
            $table->timestamp('paid_at')->nullable();
            $table->json('raw_response_json')->nullable();
            $table->timestamps();

            $table->index(['transaction_id', 'status']);
            $table->index(['external_reference']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('transactions');
    }
};
