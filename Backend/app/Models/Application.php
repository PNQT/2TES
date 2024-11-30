<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $table = 'applications';

    protected $primaryKey = 'application_id';

    public $timestamps = false;

    protected $fillable = [
        'applicant_id',
        'job_id',
        'poster_id',
        'cover_letter',     // Changed to varchar(255) as per your earlier request
        'resume_path',     // Changed to text as per your earlier request
        'status',
        'applied_at',
        'review_status',
    ];

    /**
     * Relationship: Application belongs to a Job.
     */
    public function job()
    {
        return $this->belongsTo(PostJob::class, 'job_id', 'job_id');
    }

    /**
     * Relationship: Application belongs to an Applicant (User).
     */
    public function applicant()
    {
        return $this->belongsTo(User::class, 'applicant_id', 'user_id');
    }

    /**
     * Optional: Alias for Applicant relationship.
     * Allows accessing the user via $application->user
     */
    public function user()
    {
        return $this->applicant();
    }
}