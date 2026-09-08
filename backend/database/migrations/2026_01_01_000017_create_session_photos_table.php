<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('photo_sessions')->cascadeOnDelete();
            $table->unsignedInteger('capture_order');
            $table->foreignId('media_id')->nullable()->constrained('media_files')->nullOnDelete();
            $table->string('status')->default('active'); // active, replaced
            $table->foreignId('retake_of_id')->nullable()->constrained('session_photos')->nullOnDelete();
            $table->timestamp('captured_at')->nullable();
            $table->timestamps();

            $table->index(['session_id', 'capture_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_photos');
    }
};
