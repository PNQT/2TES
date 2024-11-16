<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'], // Đảm bảo tệp là hình ảnh hợp lệ
        ]);
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        try {
            if ($request->hasFile('avatar')) {
                $imageName = time() . '.' . $request->avatar->extension();
                $request->avatar->move(public_path('uploads'), $imageName);
                $user->avatar = 'uploads/' . $imageName;
                $user->save();
            }
            $avatarUrl = asset('uploads/' . $imageName);
            return response()->json([
                'message' => 'Avatar updated successfully!',
                'avatar_url' => $avatarUrl, // Trả về URL đầy đủ
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating avatar: ' . $e->getMessage()], 500);
        }
    }

   
   
        public function informationUpdate(Request $request)
        {
            $user = $request->user();  // Lấy user từ yêu cầu (đã được xác thực qua Sanctum)
    
            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }
    
            try { 
                $user->user_name = $request->user_name;     
                $user->phone = $request->phone;
                $user->address = $request->address;
                $user->bio = $request->bio;
                $user->save();  // Lưu thay đổi
    
                return response()->json([
                    'message' => 'Information updated successfully!',
                    'user' => $user,  // Trả lại đối tượng người dùng đã được cập nhật
                ], 200);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Error updating information: ' . $e->getMessage()], 500);
            }
        }
    
    
}
