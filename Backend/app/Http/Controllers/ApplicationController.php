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
    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,job_id',
            'applicant_id' => 'required|exists:users,user_id',
            'cover_letter' => 'nullable|string',
            'poster_id' => 'nullable|exists:users,user_id',
            'resume_path' => 'nullable|string',
            
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'User is not authenticated.'], 401);
        }

        Log::info('User:', ['applicantID' => $user->user_id]);

        // Create the application
        $application = Application::create([
            'job_id' => $request->job_id,
            'applicant_id' => $request->applicant_id,
            'cover_letter' => $request->cover_letter,
            'resume_path' => $request->resume_path,
            'poster_id' => $request->poster_id,
            'status' => 'unread',
        ]);

      //  $job = PostJob::where('job_id',$request->job_id)->get();
        // $poster = User::findOrFail($job->posted_by);

        // // Send notification
        // $poster->notify(new NewApplication($application, $job));

        return response()->json([
            'message' => 'Application submitted successfully and notification sent to the poster.',
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