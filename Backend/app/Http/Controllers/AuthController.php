<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{


    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required'
        ]);


        $user = User::where('email', $request->email)->first();


        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.'
            ], 401);
        }
        
        $tokenName = $user->name ?? 'User Token';
        $token = $user->createToken($tokenName)->plainTextToken;


        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
    public function register(Request $request)
    {
        $fields = $request->validate([
            'user_name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string',
            'phone' => 'required|string',
            'user_type' => 'required|string',
            'address' => 'required|string'
        ]);

        $user = User::create($fields);

        $token = $user->createToken($request->user_name);

        return [
            'user' => $user,
            'token' => $token->plainTextToken
        ];
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return [
            'message' => 'Logged out'
        ];

    }

    public function changePassword(Request $request)
    {   
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

            $request->validate([
                    'password' => ['required', 'string'],
                    'new_password' => ['required', 'string', 'min:8'],
            ]);

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match our records.'],
            ]);
        }

        // Update the password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password successfully updated!',
        ]);
    }

    public function getAuthenticatedUser(Request $request)
    {
        return response()->json($request->user());
    }
}
