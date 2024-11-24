<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\PostJob;
use App\Models\User;
use App\Notifications\NewApplication;
use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'job_id' => 'required|exists:jobs,job_id',
    //         'applicant_id' => 'required|exists:users,user_id',
    //         'cover_letter' => 'nullable|max:2048', 
    //         'resume_path' => 'nullable|string|max:2048',
    //         'poster_id' => 'nullable|exists:users,user_id'
    //     ]); 

    //     $user = $request->user();

    //     if (!$user) {
    //         return response()->json(['message' => 'User is not authenticated.'], 401);
    //     }

   
       
    //     $cover_letter = null;
    //     if ($request->hasFile('cover_letter')) {
    //         $cvName = time() . '.' . $request->cover_letter->extension();
    //         $cover_letter = $request->cover_letter->storeAs('uploads/cover_letters', $cvName, 'public');
    //     }
    //     Log::info('Job:', ['Binnn' => $request->cover_letter]);
    //     $resume_path = $request->resume_path;
    //     // Create the application record        
    //     $application = Application::create([
    //         'job_id' => $request->job_id,
    //         'applicant_id' => $request->applicant_id,
    //         'cover_letter' => $cover_letter ? 'storage/' . $cover_letter : null, 
    //         'resume_path' => $resume_path,
    //         'poster_id' => $request->poster_id,
    //         'status' => 'unread',
    //     ]); 

    //     return response()->json([
    //         'message' => 'Application submitted successfully.',
    //         'application' => $application,
    //     ]);
    // }

    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,job_id',
            'applicant_id' => 'required|exists:users,user_id',
            'cover_letter' => 'nullable|max:20480', 
            'resume_path' => 'nullable|string|max:2048',
            'poster_id' => 'nullable|exists:users,user_id'
        ]); 
    
        $user = $request->user();
    
        if (!$user) {
            return response()->json(['message' => 'User is not authenticated.'], 401);
        }
    
        // Initialize cover letter and handle the file upload
        $cover_letter = null;
        if ($request->hasFile('cover_letter')) {
            $cvName = time() . '.' . $request->cover_letter->extension();
            $cover_letter = $request->cover_letter->storeAs('uploads/cover_letters', $cvName, 'public');
        }
    
        // Log the cover letter file if present
        if ($cover_letter) {
            Log::info('Cover letter uploaded:', ['Cover letter path' => $cover_letter]);
        } else {
            Log::info('No cover letter uploaded.');
        }
    
        $resume_path = $request->resume_path;
    
        // Create the application record
        $application = Application::create([
            'job_id' => $request->job_id,
            'applicant_id' => $request->applicant_id,
            'cover_letter' => $cover_letter ? 'storage/' . $cover_letter : null, 
            'resume_path' => $resume_path,
            'poster_id' => $request->poster_id,
            'status' => 'unread',
        ]); 
    
        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application,
        ]);
    }
    
    public function getNotifications(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications;

        return response()->json($notifications);
    }
}
