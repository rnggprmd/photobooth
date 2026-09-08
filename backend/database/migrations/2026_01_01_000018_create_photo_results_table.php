<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photo_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('photo_sessions')->cascadeOnDelete();
            $table->foreignId('template_version_id')->nullable()->constrained('template_versions')->nullOnDelete();
            $table->foreignId('final_media_id')->nullable()->constrained('media_files')->nullOnDelete();
            $table->string('result_token')->unique();
            $table->text('qr_payload')->nullable();
            $table->string('status')->default('processing'); // processing, ready, failed, expired
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['session_id']);
            $table->index(['result_token']);
            $table->index(['expires_at']);
        });

        Schema::create('photo_result_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('result_id')->constrained('photo_results')->cascadeOnDelete();
            $table->foreignId('session_photo_id')->constrained('session_photos')->cascadeOnDelete();
            $table->foreignId('template_photo_slot_id')->constrained('template_photo_slots')->cascadeOnDelete();
            $table->json('crop_config_json')->nullable(); // final crop/transform applied
            $table->timestamps();

            $table->index(['result_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photo_result_items');
        Schema::dropIfExists('photo_results');
    }
};
