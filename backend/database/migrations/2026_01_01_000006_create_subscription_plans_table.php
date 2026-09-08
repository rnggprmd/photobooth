<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Free, Starter, Business, Enterprise
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->string('billing_period')->default('monthly'); // monthly, yearly
            $table->unsignedInteger('max_events')->default(0); // 0 = unlimited
            $table->unsignedInteger('max_sessions')->default(0);
            $table->unsignedInteger('max_templates')->default(0);
            $table->unsignedBigInteger('max_storage_mb')->default(0);
            $table->unsignedInteger('max_operators')->default(0);
            $table->unsignedInteger('max_customers')->default(0);
            $table->json('features_json')->nullable(); // feature flags per plan
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
