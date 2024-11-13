<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends Controller
{
    public function index()
    {
    
           $user = User::all();
            return response()->json([
                'user' => $user
            ], 200);
            
    }

     public function login(LoginRequest $request)
     {
 
         $validatedData = $request->validated();
         logger()->info('Dữ liệu đã xác thực:', $validatedData);

         if (Auth::attempt($validatedData)) {
             return response()->json([
                 'message' => 'Đăng nhập thành công',
                 'user' => Auth::user() 
             ], 200);
         }
 
         return response()->json([
             'message' => 'Thông tin đăng nhập không chính xác'
         ], 401);
     }
}
