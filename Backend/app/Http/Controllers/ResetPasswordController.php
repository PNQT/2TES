<?php

namespace App\Http\Controllers;

    use App\Http\Requests\ResetPasswordRequest;
    use App\Http\Requests\SendEmailRequest;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Hash;
    use App\Models\User; 
    use Illuminate\Support\Facades\Mail;
    use App\Mail\ResetPasswordMail;
    use Illuminate\Support\Facades\DB;



class ResetPasswordController extends Controller
{
    /**
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
            {
                {
                $user = User::all();
                    return response()->json([
                        'user' => $user
                    ], 200);
                }    
            }
            public function sendResetLinkEmail(SendEmailRequest $request)
            {
                $request->validate(['email' => 'required|email']);
                $user = User::where('email', $request->email)->first();
        
                if (!$user) {
                    return response()->json(['message' => 'Email không tồn tại'], 404);
                }
        
                $otp = rand(100000, 999999);
                $hashedOtp = Hash::make($otp);
        
                DB::table('password_resets')
                    ->where('email', $user->email)
                    ->delete();  // Xóa các OTP cũ trước khi tạo mới
        
                DB::table('password_resets')->insert([
                    'email' => $user->email,
                    'token' => $hashedOtp, 
                    'created_at' => now(),
                ]);
        
                try {
                    Mail::to($user->email)->send(new ResetPasswordMail($otp));
                    return response()->json(['message' => 'Đã gửi OTP qua email.'], 200);
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Có lỗi khi gửi OTP: ' . $e->getMessage()], 500);
                }
            }
        
            public function resetPassword(ResetPasswordRequest $request)
            {
                $validatedData = $request->validated();
        
                $resetRecord = DB::table('password_resets')
                    ->where('email', $validatedData['email'])
                    ->first();
        
                if (!$resetRecord || !Hash::check($validatedData['otp'], $resetRecord->token)) {
                    return response()->json(['message' => 'OTP không hợp lệ hoặc đã hết hạn'], 400);
                }
        
                DB::table('password_resets')->where('email', $validatedData['email'])->delete();
        
                $user = User::where('email', $validatedData['email'])->first();
        
                if ($user) {
                    $user->password = Hash::make($validatedData['password']);
                    $user->updated_at = now();
                    $user->save();
        
                    return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công'], 200);
                }
        
                return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
            }
        
    

    public function sendResetLink(Request $request)
    {
        // Validate input email
        $request->validate(['email' => 'required|email']);

        $user = user::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email không tồn tại'], 404);
        }

        $otp = rand(100000, 999999);
        $hashedOtp = Hash::make($otp);

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $hashedOtp, 
            'created_at' => now(),

        ]);

        try {
            Mail::to($user->email)->send(new ResetPasswordMail($otp));  // Gửi OTP thay vì link
            return response()->json(['message' => 'Đã gửi OTP qua email.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Có lỗi khi gửi OTP: ' . $e->getMessage()], 500);
        }
    }

//     public function resetPassword(ResetPasswordRequest $request)
//     {
//                    // Validate input dữ liệu
//     $validatedData = $request->validated();

//     // Kiểm tra OTP có tồn tại và hợp lệ trong bảng password_resets không
//     $resetRecord = DB::table('password_resets')
//         ->where('email', $validatedData['email'])
//         ->first();

//     if (!$resetRecord || !Hash::check($validatedData['otp'], $resetRecord->token)) {
//         return response()->json(['message' => 'OTP không hợp lệ hoặc đã hết hạn'], 400);
//     }

//     DB::table('password_resets')->where('email', $validatedData['email'])->delete();


//     $user = User::where('email', $validatedData['email'])->first();

//     if ($user) {
    
//         $user->password = Hash::make($validatedData['password']);
//         $user->updated_at = now();
//         $user->save();

//         return response()->json(['message' => 'Mật khẩu đã được đặt lại thành công'], 200);
//     }

//     return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
// }
    
// }
}