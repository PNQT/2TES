<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application; // Import model Application

class NotificationController extends Controller
{
    public function getInformation(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications;

        return response()->json($notifications);
    }

    // Hàm để lấy tất cả thông tin từ bảng applications
    public function getAllApplications()
    {
        $applications = Application::all(); // Lấy tất cả thông tin từ bảng applications
        return response()->json($applications);
    }

    public function getApplicationById($poster_id)
    {
        $applications = Application::where('poster_id', $poster_id)
            ->orderBy('applied_at', 'desc')
            ->get();


        if ($applications->isEmpty()) {
            // return response()->json([
            //     'message' => 'No applications found for this poster ID',
            // ], 404);
            $applications = [];
        }

        return response()->json([
            'message' => 'Applications retrieved successfully',
            'data' => $applications,
        ], 200);
    }

    public function markAsRead($job_id, $poster_id)
    {
        // Fetch all notifications that match the job_id and poster_id
        $notifications = Application::where('job_id', $job_id)
            ->where('poster_id', $poster_id)
            ->get();
        $information = Application::where('job_id', $job_id)
            ->where('poster_id', $poster_id)
            ->first();

        // If no notifications found, return a 404 response
        if ($notifications->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No notifications found'
            ], 404);
        }

        foreach ($notifications as $notification) {
            $notification->status = 'read';
            $notification->save();  
        }
    
        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read'
        ], 200);
    }

    public function getUnreadNotifications($application_id)
    {
        $notifications = Application::where('application_id', $application_id)
                                     ->where('status', 'unread') 
                                     ->get(); 
    
        if ($notifications->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No unread notifications found.'
            ], );
        }
    
        foreach ($notifications as $notification) {
            $notification->status = 'read';  
            $notification->save(); 
        }
    
        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read.'
        ], 200);
    }
    
}
