<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            // 'title' => 'required|string|max:255',
            // 'description' => 'required|string',
            // 'requirements' => 'nullable|string',
            // 'benefits' => 'nullable|string',
            // 'companyInfo' => 'nullable|string',
            // 'location' => 'required|string',
            // 'employmentType' => 'required|string',
            // 'salary' => 'nullable|numeric',
            // 'deadline' => 'nullable|date',
            // 'contactEmail' => 'required|email',
            // 'contactPhone' => 'nullable|string',
            // 'applicationProcess' => 'nullable|string',
            // 'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
           'employer_id' => 'required|numeric',
            'title' => 'required|string|max:255',
            'company_name' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'salary' => 'nullable|numeric',
            'location' => 'required|string',
            'job_type' => 'required|string',
            'created_at' => 'nullable|date',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
