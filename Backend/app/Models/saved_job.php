<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class saved_job extends Model
{
    use HasFactory;

    protected $table = 'saved_jobs';

    protected $primaryKey = ['saved_id','job_id','user_id'];

    protected $fillable = [
        'job_id',
        'user_id',
        'saved_at',
        
    ];
}
