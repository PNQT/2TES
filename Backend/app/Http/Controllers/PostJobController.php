<?php
namespace App\Http\Controllers;

use App\Http\Requests\StorePostJobRequest;
use App\Models\Job;
use App\Models\PostJob;
use Illuminate\Http\Request;

class PostJobController extends Controller
{
    public function store(StorePostJobRequest $request)
    {
        // Retrieve the validated input data
        $validated = $request->validated();
        if ($request->hasFile('image')) {
                            $imageName = time() . '.' . $request->image->extension();
                            $request->image->move(public_path('uploads'), $imageName);
                            $validated['image'] = 'uploads/' . $imageName;
                        }

     

        // Save data to the database
        $job = PostJob::create($validated);
      
        return response()->json([
            'message' => 'Job posted successfully',
            'job' => $job
        ], 200);
    }

    public function index()
    {
        $jobs = PostJob::all();

        return response()->json([
            'jobs' => $jobs
        ], 200);
    }
    public function show($id)
    {
        $job = PostJob::find($id);

        if (!$job) {
            return response()->json([
                'message' => 'Job not found'
            ], 404);
        }

        return response()->json([
            'job' => $job
        ], 200);
    }
    public function update(StorePostJobRequest $request, $id)
    {
        // Retrieve the validated input data
        $validated = $request->validated();

        $job = PostJob::find($id);

        if (!$job) {
            return response()->json([
                'message' => 'Job not found'
            ], 404);
        }

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('uploads'), $imageName);
            $validated['image'] = 'uploads/' . $imageName;
        }

        // Update the job
        $job->update($validated);

        return response()->json([
            'message' => 'Job updated successfully',
            'job' => $job
        ], 200);
    }
    public function destroy($id)
    {
        $job = PostJob::find($id);

        if (!$job) {
            return response()->json([
                'message' => 'Job not found'
            ], 404);
        }

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully'
        ], 200);
    }

    public function search(Request $request)
    {
        $keyword = $request->get('q', '');

        if (empty($keyword)) {
            $jobs = PostJob::all();
        } else {
            $jobs = PostJob::query()

                ->where('title', 'like', '%' . $keyword . '%')
                ->orWhere('description', 'like', '%' . $keyword . '%')
                ->orWhere('requirements', 'like', '%' . $keyword . '%')
                ->orwhere('company_name', 'like', '%' . $keyword . '%')
                ->orWhere('location', 'like', '%' . $keyword . '%')
                ->orWhere('job_type', 'like', '%' . $keyword . '%')
                ->orWhere('salary', 'like', '%' . $keyword . '%')

                ->orWhere('contact_email', 'like', '%' . $keyword . '%')
                ->orWhere('contact_phone', 'like', '%' . $keyword . '%')
                ->get();

        }

        return response()->json([
            'message' => 'Job search results',
            'data' => $jobs
        ], 200);
    }
    public function getUserPostedJobs(Request $request)
    {
        // Lấy `user_id` từ request
        $userId = $request->input('user_id');

        // Kiểm tra nếu `user_id` không được cung cấp
        if (!$userId) {
            return response()->json(['error' => 'User ID is required'], 400);
        }

        // Lấy danh sách công việc dựa trên `user_id`
        $jobs = PostJob::where('employer_id', $userId)->get();

        // Trả về danh sách công việc
        return response()->json($jobs);
    }
}