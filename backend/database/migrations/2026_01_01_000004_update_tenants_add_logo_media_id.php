<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update tenants table to add logo_media_id FK after media_files is created
        Schema::table('tenants', function (Blueprint $table) {
            $table->foreignId('logo_media_id')->nullable()->after('slug')->constrained('media_files')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropForeign(['logo_media_id']);
            $table->dropColumn('logo_media_id');
        });
    }
};
