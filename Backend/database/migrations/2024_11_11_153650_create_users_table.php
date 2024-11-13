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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('user_name', 50)->unique();
            $table->string('password');
            $table->string('email', 100)->unique();
            $table->string('phone', 15)->nullable();
            $table->string('address')->nullable();
            $table->string('bio')->nullable();
            $table->enum('user_type', ['employer', 'candidate']); 
            $table->string('avatar')->nullable();
            $table->enum('status', ['active', 'inactive']);
           
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
