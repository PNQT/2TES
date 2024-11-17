<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class PostJob extends Model
{ 
    use HasFactory;
    protected $table = 'jobs';
    protected $fillable = [
        // 'job_id',
        // 'description',
        // 'requirements',
        // 'benefits',
        // 'companyInfo',
        // 'location',
        // 'employmentType',
        // 'salary',
        // 'deadline',
        // 'contactEmail',
        // 'contactPhone',
        // 'applicationProcess',
        // 'image'
        'job_id',
        'employer_id',
        'title',
        'company_name',
        'description',
        'requirements',
        'salary',
        'location',
        'job_type',
        'created_at',
        'updated_at',
        'contact_email',
        'contact_phone',
        'image',
    ];

}
