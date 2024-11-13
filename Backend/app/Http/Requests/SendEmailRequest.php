<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendEmailRequest extends FormRequest
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
            'email' => 'required|email|exists:users,email', // Kiểm tra email hợp lệ và có tồn tại trong bảng users
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
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Vui lòng nhập một email hợp lệ.',
            'email.exists' => 'Email không tồn tại trong hệ thống.',
        ];
    }
}
