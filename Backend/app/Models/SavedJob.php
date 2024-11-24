<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SavedJob extends Model
{
    use HasFactory;

    protected $table = 'saved_jobs';
    protected $primaryKey = 'saved_id';

    public $timestamps = false; 

    protected $fillable = [
        'job_id',
        'user_id',
        'saved_at',
    ];
}
