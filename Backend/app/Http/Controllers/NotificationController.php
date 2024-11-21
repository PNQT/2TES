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
        $applications = Application::where('poster_id', $poster_id)->get();
        
    
        if ($applications->isEmpty()) {
            return response()->json([
                'message' => 'No applications found for this poster ID',
            ], 404);
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

    // If no notifications found, return a 404 response
    if ($notifications->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No notifications found'
        ], 404);
    }

    // Loop through all notifications and update their status
    foreach ($notifications as $notification) {
        $notification->status = 'read';
        $notification->save();  // Save the individual notification
    }

    return response()->json([
        'success' => true,
        'message' => 'All notifications marked as read'
    ], 200);
}

    
}