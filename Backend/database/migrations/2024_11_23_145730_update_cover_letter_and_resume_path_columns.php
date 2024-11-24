<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::table('applications', function (Blueprint $table) {
        $table->string('cover_letter', 255)->nullable()->change(); // Đổi thành VARCHAR(255)
        $table->text('resume_path')->nullable()->change(); // Đổi thành TEXT
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->text('cover_letter')->nullable()->change(); // Hoàn tác về TEXT (hoặc kiểu cũ nếu khác)
            $table->string('resume_path', 255)->nullable()->change(); // Hoàn tác về VARCHAR(255) (hoặc kiểu cũ)
        });
    }
};
