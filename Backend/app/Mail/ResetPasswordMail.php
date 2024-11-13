<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;  // OTP cần gửi

    /**
     * Tạo một instance mới cho mail.
     */
    public function __construct($otp)
    {
        $this->otp = $otp; // Lưu OTP vào biến
    }

    /**
     * Xây dựng thông tin email.
     */
    public function build()
    {
        return $this->subject('Xác minh OTP đặt lại mật khẩu') // Tiêu đề email
                    ->view('emails.reset_password')  // Sử dụng view để hiển thị nội dung email
                    ->with([
                        'otp' => $this->otp,  // Truyền OTP vào view
                    ]);
    }
}
