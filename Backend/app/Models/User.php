<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    // Tên bảng và các thuộc tính chính
    protected $table = 'users';
    protected $primaryKey = 'user_id'; // Đặt tên cột khóa chính
    public $incrementing = true;
    protected $keyType = 'int';

    // Các trường được phép điền
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

    // Các trường ẩn khi trả về dữ liệu
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $timestamps = true;

    /**
     * Boot method: Gán giá trị mặc định cho các thuộc tính
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            
            if ($user->password) {
                $user->password = Hash::make($user->password);
            }
            $user->user_name = $user->user_name ?? 'Anonymous';
            $user->status = $user->status ?? 'active';
            $user->avatar = $user->avatar ?? 'uploads/default-avatar.jpg';
            $user->bio = $user->bio ?? 'Chưa có thông tin';
        });
    }

    /**
     * Mutator: Xử lý giá trị avatar để trả về đường dẫn đầy đủ
     */
    public function getAvatarAttribute($value)
    {
        return $value ? asset($value) : asset('uploads/default-avatar.jpg');
    }

    /**
     * Mutator: Xử lý giá trị bio để thiết lập mặc định khi lưu
     */
    public function setBioAttribute($value)
    {
        $this->attributes['bio'] = $value ?: 'Chưa có thông tin';
    }

    /**
     * Mối quan hệ: Người dùng -> Công việc đã đăng
     */
    public function jobs()
    {
        return $this->hasMany(PostJob::class, 'employer_id');
    }

    /**
     * Mối quan hệ: Người dùng -> Hồ sơ ứng tuyển
     */
    public function applications()
    {
        return $this->hasMany(Application::class, 'applicant_id');
    }

    /**
     * Kiểm tra loại tài khoản có phải là nhà tuyển dụng không
     */
    public function isEmployer()
    {
        return $this->user_type === 'employer';
    }

    /**
     * Kiểm tra loại tài khoản có phải là ứng viên không
     */
    public function isCandidate()
    {
        return $this->user_type === 'candidate';
    }
}
