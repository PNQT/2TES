<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\PostJob;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationController extends Controller
{
    // Store application
    public function store(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,job_id',
            'applicant_id' => 'required|exists:users,user_id',
            'cover_letter' => 'nullable|file|max:20480', // 20MB max
            'resume_path' => 'nullable|string|max:2048',
            'poster_id' => 'nullable|exists:users,user_id'
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'User is not authenticated.'], 401);
        }

        $cover_letter = null;
        if ($request->hasFile('cover_letter')) {
            $cvName = time() . '.' . $request->cover_letter->extension();
            $cover_letter = $request->cover_letter->storeAs('uploads/cover_letters', $cvName, 'public');
        }

        $application = Application::create([
            'job_id' => $request->job_id,
            'applicant_id' => $request->applicant_id,
            'cover_letter' => $cover_letter ? 'storage/' . $cover_letter : null,
            'resume_path' => $request->resume_path,
            'poster_id' => $request->poster_id,
            'status' => 'unread',
            'review_status' => 'pending', // Default review status
        ]);

        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application,
        ]);
    }

    // Fetch notifications
    public function getNotifications(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications;

        return response()->json($notifications);
    }

    // Fetch applied jobs
    public function getAppliedJobs($id)
    {
        $info = Application::with(['job:job_id,title,company_name,location'])
            ->where('applicant_id', $id)
            ->get();

        if ($info->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No applications found'
            ], 404);
        }

        $applications = $info->map(function ($application) {
            return [
                'applicant_id' => $application->applicant_id,
                'title' => $application->job->title ?? null,
                'location' => $application->job->location ?? null,
                'company_name' => $application->job->company_name ?? null,
                'application_status' => $application->status,
                'applied_at' => $application->applied_at,
                'cover_letter' => $application->cover_letter,
                'resume_path' => $application->resume_path,
                'review_status' => $application->review_status,
            ];
        });

        return response()->json([
            'success' => true,
            'applications' => $applications,
        ], 200);
    }

    // Fetch job applicants
    public function getJobApplicants($jobId)
    {
        $applications = Application::with('user')
            ->where('job_id', $jobId)
            ->get();

        $result = $applications->map(function ($application) {
            return [
                'email' => $application->user->email ?? 'N/A',
                'user_name' => $application->user->user_name ?? 'N/A',
                'cover_letter' => $application->cover_letter,
                'resume_path' => $application->resume_path,
                'applied_at' => $application->applied_at,
                'application_id' => $application->application_id,
                'review_status' => $application->review_status,
            ];
        });

        return response()->json($result);
    }

    // Approve application
    public function approve($id)
    {
        $application = Application::find($id);
        if ($application) {
            $application->review_status = 'approved';
            $application->save();
            return response()->json(['message' => 'Application approved.'], 200);
        }
        return response()->json(['message' => 'Application not found.'], 404);
    }

    // Reject application
    public function reject($id)
    {
        $application = Application::find($id);
        if ($application) {
            $application->review_status = 'rejected';
            $application->save();
            return response()->json(['message' => 'Application rejected.'], 200);
        }
        return response()->json(['message' => 'Application not found.'], 404);
    }

    // Stream real-time updates (SSE)
    // public function streamReviewStatusUpdates(Request $request)
    // {
    //     $userId = $request->user()->id;

    //     return new StreamedResponse(function () use ($userId) {
    //         $startTime = time();
    //         $timeout = 300; 

    //         while (true) {
    //             $updatedApplications = Application::where('applicant_id', $userId)
    //                 ->where('review_status', true)
    //                 ->get();

    //             if ($updatedApplications->isNotEmpty()) {
    //                 echo "data: " . json_encode($updatedApplications) . "\n\n";
    //                 ob_flush();
    //                 flush();
    //             }

    //             if ((time() - $startTime) > $timeout) {
    //                 break;
    //             }

    //             sleep(5); // Polling interval
    //         }
    //     }, 200, [
    //         'Content-Type' => 'text/event-stream',
    //         'Cache-Control' => 'no-cache',
    //         'Connection' => 'keep-alive',
    //     ]);
    // }
    public function checkReviewStatus($user_id)
    {
        $startTime = time();
        $timeout = 300; 
    
        while (true) {
            $updatedApplications = Application::where('applicant_id', $user_id)
                ->whereIn('review_status', ['pending', 'approved', 'rejected'])
                ->get();  
            if ($updatedApplications->isNotEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'applications' => $updatedApplications
                ]);
            } 
            if ((time() - $startTime) > $timeout) {
                return response()->json([
                    'status' => 'timeout',
                    'message' => 'No updates available after waiting for ' . $timeout . ' seconds.'
                ]);
            }          
            sleep(5); 
        }
    }
    

}

                