<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SavedJob;
use Illuminate\Support\Facades\DB;




class SavedJobController extends Controller
{
    public function check(Request $request)
    {
        $userId = $request->query('user_id');

    // Nếu không có user_id, trả về phản hồi trống với mã 204
    if (!$userId) {
        return response()->noContent();
    }

    // Lấy danh sách các job_id mà user đã lưu
    $savedJobs = SavedJob::where('user_id', $userId)
        ->pluck('job_id')
        ->toArray();

    return response()->json(['savedJobIds' => $savedJobs]);
}

    // Lưu công việc
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        SavedJob::create([
            'job_id' => $validated['job_id'],
            'user_id' => $validated['user_id'],
            'saved_at' => now(),
        ]);

        return response()->json(['message' => 'Job saved successfully!']);
    }

    // Xóa công việc đã lưu
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'job_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        SavedJob::where('job_id', $validated['job_id'])
            ->where('user_id', $validated['user_id'])
            ->delete();

        return response()->json(['message' => 'Job unsaved successfully!']);
    }

    
    public function getSavedJobs(Request $request)
    {
        $userId = $request->user()->user_id; // Lấy user_id từ token đã xác thực

        // Lấy danh sách công việc đã lưu của người dùng
        $savedJob = DB::table('saved_jobs')
            ->join('jobs', 'saved_jobs.job_id', '=', 'jobs.job_id')
            ->where('saved_jobs.user_id', $userId)
            ->select('jobs.*')
            ->get();

        return response()->json($savedJob, 200);
    }
    
    public function getSavedJobIds(Request $request, $id)
{
    // $userId = $request->input('user_id'); 

    // Kiểm tra nếu không có user_id
    if (!$id) {
        return response()->json([
            'message' => 'User ID is required.',
        ], 400);
    }

    $savedJobIds = DB::table('saved_jobs')
        ->where('user_id', $id)
        ->pluck('job_id'); 

    return response()->json([
        'job_ids' => $savedJobIds,
    ], 200);
}
}
