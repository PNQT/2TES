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
            $table->foreignId(('poster_id'))->constrained('users', column: 'user_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->text('cover_letter')->nullable(); 
            $table->string('resume_path')->nullable();
            $table->enum('status', ['unread', 'read'])->default('unread');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropTimestamps();
        });
    }
};
