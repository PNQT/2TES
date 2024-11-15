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
        'avatar' => ['required', 'image', 'max:2048'], // Chỉ nhận file ảnh, tối đa 2MB
    ]);

    $user = $request->user();

    // Kiểm tra xem người dùng có tồn tại không
    if (!$user) {
        return response()->json([
            'message' => 'User not found.',
        ], 404);
    }

    // Xóa avatar cũ nếu tồn tại
    if ($user->avatar) {
        Storage::disk('public')->delete($user->avatar);
    }

    // Lưu file mới và tạo URL đầy đủ của file
    $filename = $user->id . '_avatar.' . $request->file('avatar')->getClientOriginalExtension();
    $path = $request->file('avatar')->storeAs('avatars', $filename, 'public');

    // Tạo URL đầy đủ của avatar
    $avatarUrl = asset('storage/avatars/' . $filename);

    // Cập nhật URL vào database
    $user->avatar = $avatarUrl; // Lưu URL đầy đủ vào database
    $user->save();

    // Trả về URL mới của avatar
    return response()->json([
        'message' => 'Avatar updated successfully!',
        'avatar_url' => $avatarUrl,
    ], 200);
}


}
