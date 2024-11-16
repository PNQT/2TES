<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostJobController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();    
})->middleware('auth:sanctum'); 

Route::get('/search',  [PostJobController::class, 'search']);

Route::get('/jobs', [PostJobController::class, 'index']);

Route::post('/jobs', [PostJobController::class, 'store']);

Route::get('/jobs/{id}', [PostJobController::class, 'show']);

Route::put('/jobs/{id}', [PostJobController::class, 'update']);

Route::delete('/jobs/{id}', [PostJobController::class, 'destroy']);


// Route::get('/register', [RegisterController::class, 'index']);

// Route::post('/register', [RegisterController::class, 'signup']);

// Route::get('/register/{id}', [RegisterController::class, 'show']);

// Route::put('/register/{id}', [RegisterController::class, 'update']);

// Route::delete('/register/{id}', [RegisterController::class, 'destroy']);

// Route::post('/login', [LoginController::class, 'login']);


Route::post('/password/email', [ResetPasswordController::class, 'sendResetLinkEmail']);  // Route gửi email

Route::post('/password/reset', [ResetPasswordController::class, 'resetPassword']); 



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/avatar', [ProfileController::class, 'updateAvatar']);
    Route::post( '/user/profile', [ProfileController::class, 'informationUpdate']); 
    Route::post('/user/changePassword', [AuthController::class, 'changePassword']);  
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
