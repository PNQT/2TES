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


    // public function getAppliedJobs(Request $request ,$id)
    // {
    //     $info = Application::where('applicant_id',$id)->get();
    //     if (!$info) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'No applications found'
    //         ], 404);
    //     }
    //     return response()->json([
    //         'applications' => $info
    //     ], 200);
    // }
    public function getAppliedJobs(Request $request, $id)
{
    // Lấy dữ liệu applications và tải dữ liệu từ bảng jobs
    $info = Application::with(['job:job_id,title,company_name,location'])
                       ->where('applicant_id', $id)
                       ->get();

    if ($info->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No applications found'
        ], 404);
    }

    // Định dạng lại dữ liệu trả về
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


        ];
    });

    return response()->json([
        'success' => true,
        'applications' => $applications,
    ], 200);
}

}
