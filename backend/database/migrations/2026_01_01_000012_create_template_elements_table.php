<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_version_id')->constrained('template_versions')->cascadeOnDelete();
            $table->string('element_type'); // overlay, text, logo, sticker
            $table->unsignedInteger('z_index')->default(1);
            $table->decimal('position_x', 10, 4)->default(0);
            $table->decimal('position_y', 10, 4)->default(0);
            $table->decimal('width', 10, 4)->nullable();
            $table->decimal('height', 10, 4)->nullable();
            $table->decimal('rotation', 8, 4)->default(0);
            $table->foreignId('media_id')->nullable()->constrained('media_files')->nullOnDelete();
            $table->json('config_json')->nullable(); // font, color, text content, opacity, etc.
            $table->timestamps();

            $table->index(['template_version_id', 'z_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_elements');
    }
};
