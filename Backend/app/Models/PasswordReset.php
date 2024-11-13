<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PasswordReset extends Model
{
    use HasFactory;

    protected $table = 'password_resets'; // Đặt tên bảng cho model này

    protected $fillable = ['email', 'token']; // Các trường được phép gán

    public $timestamps = true; // Laravel sẽ tự động quản lý trường created_at và updated_at

 
}
