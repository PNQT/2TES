<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PostJob;


class Application extends Model
{
    use HasFactory;

    protected $table = 'applications';

    protected $primaryKey = 'application_id';

    public $timestamps = false;

    protected $fillable = [
        'applicant_id',
        'job_id',
        'applicant_id',
        'poster_id',
        'cover_letter',
        'resume_path',
        'status',
        'applied_at',
    ];

    public function job()
    {
        return $this->belongsTo(PostJob::class, 'job_id', 'job_id');
    }


}
