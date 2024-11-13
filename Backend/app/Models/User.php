<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasFactory;

    protected $table = 'users';
    protected $primaryKey = 'user_id'; // Đặt tên cột khóa chính của bạn ở đây
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'user_name', 
        'email', 
        'password', 
        'phone', 
        'user_type', 
        'avatar',
        'address',
        'bio',
        'status'
    ];

    protected $hidden = [
        // 'password',
    ];

    public $timestamps = true;

    public static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if ($user->password) {
                $user->password = Hash::make($user->password);
            }
            if (is_null($user->status)) {
                $user->status = 'active';
            }
            if (is_null($user->avatar)) {
                $user->avatar = 'default.jpg';
            }
            if (is_null($user->bio)) {
                $user->bio = 'Chưa có thông tin';
            }
        });

        // static::updating(function ($user) {
        //     if ($user->password) {
        //         $user->password = Hash::make($user->password);
        //     }
        // });
    }

    public function jobs()
    {
        return $this->hasMany(PostJob::class, 'employer_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'applicant_id');
    }

    public function isEmployer()
    {
        return $this->user_type === 'employer';
    }

    public function isCandidate()
    {
        return $this->user_type === 'candidate';
    }
}