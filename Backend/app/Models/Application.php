<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $table = 'applications';

    protected $primaryKey = ['application_id','applicant_id','job_id'];

    protected $fillable = [
        'applicant_id',
        'job_id',
        'applicant_id',
        'cover_letter',
        'resume',
        'status',
        'applied_at',
    ];


}
