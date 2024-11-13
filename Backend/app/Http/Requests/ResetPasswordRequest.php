<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class ResetPasswordRequest extends FormRequest
{
     /**
     * Xác định người dùng có quyền thực hiện yêu cầu này hay không.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Cho phép mọi người thực hiện yêu cầu
    }

    /**
     * Xác thực dữ liệu được gửi lên.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email|exists:users,email', 
            'otp' => 'required|numeric',
            'password' => 'required|string|min:8',  // Xác nhận mật khẩu
             // OTP cần phải là số
        ];
    }

    /**
     * Tùy chọn: Xử lý thông báo lỗi
     *
     * @return array
     */
    public function messages()
    {
        return [
        ];
    }

}
