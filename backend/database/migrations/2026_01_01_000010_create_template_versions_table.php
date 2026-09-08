<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('templates')->cascadeOnDelete();
            $table->unsignedInteger('version_number')->default(1);
            $table->foreignId('design_media_id')->nullable()->constrained('media_files')->nullOnDelete();
            $table->foreignId('preview_media_id')->nullable()->constrained('media_files')->nullOnDelete();
            $table->unsignedInteger('canvas_width')->default(0);
            $table->unsignedInteger('canvas_height')->default(0);
            $table->string('status')->default('active'); // active, archived
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['template_id', 'version_number']);
        });

        // Now add the FK from templates to template_versions
        Schema::table('templates', function (Blueprint $table) {
            $table->foreign('current_version_id')->references('id')->on('template_versions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropForeign(['current_version_id']);
        });
        Schema::dropIfExists('template_versions');
    }
};
