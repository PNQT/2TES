<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\RegisterRequest;

class RegisterController extends Controller
{
    public function index()
    {
        {
           $user = user::all();
            return response()->json([
                'user' => $user
            ], 200);
        }    
    }

    public function signup(RegisterRequest $request)
    {
        try {
            // Validate data
            $validatedData = $request->validated();
    
            // Optionally handle file uploads if you plan to support it
            // if ($request->hasFile('avatar')) {
            //     $imageName = time() . '.' . $request->avatar->extension();
            //     $request->avatar->move(public_path('uploads'), $imageName);
            //     $validatedData['avatar'] = 'uploads/' . $imageName;
            // }
    
            // Create a new user
            $user = User::create($validatedData);
    
            return response()->json([
                'message' => 'Account created successfully',
                'user' => $user
            ], 201);
    
        } catch (\Exception $e) {
            // Catch any unexpected errors
            return response()->json([
                'error' => 'Something went wrong. Please try again later.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        return User::find(id: $id);
    }

    public function update(Request $request, $id)
    {
        $account = User::findOrFail($id);
        $account->update($request->all());
    
        return response()->json([
            'message' => 'Account updated successfully',
            'user' => $account
        ], 200);
    }

    public function destroy($id)
    {
        $account = User::findOrFail($id);

        $account->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ], 200);
    }
}
