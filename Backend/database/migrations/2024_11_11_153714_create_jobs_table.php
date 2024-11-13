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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id('job_id');
            $table->foreignId('employer_id')->constrained('users', 'user_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->string('title', 100);
            $table->string('company_name', 100);
            $table->text('description')->nullable();
            $table->text('requirements')->nullable();
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('location', 100)->nullable();
            $table->enum('job_type', ['full_time', 'part_time', 'internship', 'contract']);
            $table->string('contact_email', 100)->nullable();
            $table->string('contact_phone', 15)->nullable();
            $table->timestamp('posted_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->string('image')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jobs');
    }
};
