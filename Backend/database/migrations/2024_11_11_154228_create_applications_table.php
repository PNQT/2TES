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
        Schema::create('applications', function (Blueprint $table) {
            $table->id('application_id');
            $table->foreignId('job_id')->constrained('jobs', 'job_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->foreignId('applicant_id')->constrained('users', 'user_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->text('cover_letter')->nullable();
            $table->string('resume')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'accepted', 'rejected'])->default('pending');
            $table->timestamp('applied_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
    }
};
