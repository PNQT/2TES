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
        Schema::create('job_categories', function (Blueprint $table) {
            $table->foreignId('job_id')->constrained('jobs', 'job_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->foreignId('category_id')->constrained('categories', 'category_id')->cascadeOnDelete()->restrictOnUpdate();
            $table->primary(['job_id', 'category_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('job_categories');
    }
    
};
