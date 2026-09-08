<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('operator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('mode'); // onsite, online
            $table->string('session_token')->unique();
            $table->string('status')->default('pending'); // pending, active, processing, completed, failed, expired
            $table->foreignId('selected_template_version_id')->nullable()->constrained('template_versions')->nullOnDelete();
            $table->unsignedInteger('retake_count')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'event_id']);
            $table->index(['tenant_id', 'customer_id']);
            $table->index(['session_token']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_sessions');
    }
};
