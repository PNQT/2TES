<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostJobController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\NotificationController;

Route::get('/user', function (Request $request) {
    return $request->user();    
})->middleware('auth:sanctum'); 

Route::get('/joball', [PostJobController::class, 'getAllJobs']);

Route::get('/search',  [PostJobController::class, 'search']);

Route::get('/jobs', [PostJobController::class, 'index']);

Route::post('/jobs', [PostJobController::class, 'store']);

// Route::get('/jobs/{id}', [PostJobController::class, 'show']);

Route::post('/jobedit/{id}', [PostJobController::class, 'update']);

Route::delete('/jobs/{id}', [PostJobController::class, 'destroy']);

Route::post('/jobs/YourPosted', [PostJobController::class, 'getUserPostedJobs']);



 Route::post('/jobdelete/{id}', [PostJobController::class, 'destroy']);


Route::get('/saved_job/check', [SavedJobController::class, 'check']);
Route::post('/saved_job', [SavedJobController::class, 'store']);
Route::delete('/saved_job', [SavedJobController::class, 'destroy']);
Route::middleware('auth:sanctum')->post('/jobs/YourSaved', [SavedJobController::class, 'getSavedJobs']);



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

Route::post('/password/email', [ResetPasswordController::class, 'sendResetLinkEmail']);  // Route gửi email
Route::post('/password/reset', [ResetPasswordController::class, 'resetPassword']); 
Route::post('/logout', action: [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getAuthenticatedUser']);

// Route::get('/notifiactionall',[NotificationController::class, 'getAllApplications']);
Route::get('/notifiaction/{id}',[NotificationController::class, 'getApplicationById']); 


Route::get('/user/{id}', [UserController::class, 'getUserById']);


  

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/notifications', [ApplicationController::class, 'getNotifications']);
    Route::get('/applications', [ApplicationController::class, 'index']);

    
});

Route::put('/notifications/{job_id}/{poster_id}/read', [NotificationController::class, 'markAsRead']);
Route::get('/notifications/{application_id}', [NotificationController::class, 'getUnreadNotifications']);
