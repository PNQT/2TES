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
        Schema::create('saved_jobs', function (Blueprint $table) {
            $table->id('saved_id');
            $table->foreignId('job_id')->constrained('jobs', 'job_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->foreignId('user_id')->constrained('users', 'user_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->timestamp('saved_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('saved_jobs');
    }
};
