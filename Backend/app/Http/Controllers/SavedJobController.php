<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SavedJob;
use Illuminate\Support\Facades\DB;




class SavedJobController extends Controller
{
    public function check(Request $request)
    {
        $jobId = $request->query('job_id');
        $userId = $request->query('user_id');

        $isSaved = SavedJob::where('job_id', $jobId)->where('user_id', $userId)->exists();

        return response()->json(['isSaved' => $isSaved]);
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
}
