<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->string('paper_size')->default('4R'); // 2R, 4R, 5R, custom
            $table->string('orientation')->default('portrait'); // portrait, landscape
            $table->unsignedInteger('canvas_width')->default(0);  // in pixels
            $table->unsignedInteger('canvas_height')->default(0); // in pixels
            $table->string('status')->default('draft'); // draft, active, inactive, archived
            $table->unsignedBigInteger('current_version_id')->nullable(); // points to active template_version
            $table->foreignId('preview_media_id')->nullable()->constrained('media_files')->nullOnDelete();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
