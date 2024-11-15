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
            $table->string('user_name')->default('Anonymous'); // Set a default value
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('user_type')->nullable();
            $table->string('avatar')->default('default.jpg');
            $table->string('address')->nullable();
            $table->text('bio')->default('Chưa có thông tin');
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
