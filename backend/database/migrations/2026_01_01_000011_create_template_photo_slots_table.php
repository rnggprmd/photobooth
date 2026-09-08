<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_photo_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_version_id')->constrained('template_versions')->cascadeOnDelete();
            $table->string('slot_key'); // e.g. "slot_1", "slot_2"
            $table->unsignedInteger('slot_order')->default(0);
            $table->decimal('position_x', 10, 4)->default(0);
            $table->decimal('position_y', 10, 4)->default(0);
            $table->decimal('width', 10, 4);
            $table->decimal('height', 10, 4);
            $table->decimal('rotation', 8, 4)->default(0);
            $table->string('crop_mode')->default('cover'); // cover, contain, fill
            $table->string('mask_type')->nullable(); // none, circle, rounded, custom
            $table->json('mask_config_json')->nullable();
            $table->timestamps();

            $table->index(['template_version_id', 'slot_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_photo_slots');
    }
};
