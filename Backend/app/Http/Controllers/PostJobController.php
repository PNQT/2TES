<?php
namespace App\Http\Controllers;

use App\Http\Requests\StorePostJobRequest;
use App\Models\Job;
use App\Models\PostJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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
    public function show($job_id)
    {

        $job = PostJob::where('job_id',$job_id)->get();

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found'
            ], 404);
        }

        return response()->json([
            'job' => $job
        ], 200);
    }
//     public function update(Request $request , $id)
// {
  
//     // Kiểm tra ID có hợp lệ không
//     if (!$id) {
//         return response()->json(['error' => 'Invalid ID provided'], 400);
//     }
//     $validated = $request->validated();
//     // Tìm công việc theo ID
//     $job = PostJob::where('job_id', $id)->first();

//     if (!$job) {
//         return response()->json(['error' => 'Job not found'], 404);
//     }

//     // Cập nhật dữ liệu từ request
//     $job->title = $validated->input('title', $job->title);
//     $job->description = $validated->input('description', $job->description);
//     $job->requirements = $validated->input('requirements', $job->requirements);
//     $job->company_name = $validated->input('company_name', $job->company_name);
//     $job->location = $validated->input('location', $job->location);
//     $job->job_type = $validated->input('job_type', $job->job_type);
//     $job->salary = $validated->input('salary', $job->salary);
//     $job->contact_email = $validated->input('contact_email', $job->contact_email);
//     $job->contact_phone = $validated->input('contact_phone', $job->contact_phone);

//     // Kiểm tra nếu có file ảnh trong validated
//     if ($validated->hasFile('image')) {
//         // Xóa ảnh cũ nếu có
//         if ($job->image && Storage::exists('public/' . $job->image)) {
//             Storage::delete('public/' . $job->image);
//         }

//         // Lưu ảnh mới vào thư mục 'uploads' và lấy đường dẫn
//         $imageName = time() . '.' . $validated->image->extension(); // Tạo tên file ảnh mới
//         $validated->image->move(public_path('uploads'), $imageName); // Di chuyển ảnh vào thư mục public/uploads
//         $job->image = 'uploads/' . $imageName; // Lưu đường dẫn ảnh vào CSDL
//     }

//     Log::info('Job updated', ['job' => $job]);

//     // Lưu thay đổi
//     $job->save();

//     // Trả về phản hồi thành công
//     return response()->json(['message' => 'Job updated successfully!', 'job' => $job]);
// }

    
    public function update ( Request $request, $id){
        $job = PostJob::where('job_id',$id);
        if (!$job) {
            return response()->json(['error' => 'Job not found'], 404);
        }
        $job->update($request->all());
        return response()->json($job);
    }

    public function destroy($id)
        {
            $job = PostJob::where('job_id', $id);

            if (!$job) {
                return response()->json(['error' => 'Job not found'], 404);
            }

            // Xóa công việc
            $job->delete();

            return response()->json(['message' => 'Job deleted successfully!']);
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

    
        public function getAllJobs()
        {
            // Lấy tất cả các công việc
            $jobs = PostJob::all();

            // Trả về dữ liệu dưới dạng JSON
            return response()->json($jobs);
        }

        public function getJobDetails($jobId)
{
    $job = PostJob::find($jobId);
    
    // Định dạng ngày tháng năm
    $formattedDate = Carbon::parse($job->created_at)->format('Y-m-d'); // Lấy ngày, tháng, năm (YYYY-MM-DD)
    
    return view('job.details', compact('job', 'formattedDate'));
}
       
      public function countJobs($name){
        $count = PostJob::where('title', 'like', '%' . $name . '%')->count();
        return response()->json($count);
      }
}