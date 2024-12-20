<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class job_category extends Model
{
    use HasFactory;

    protected $table = 'job_categories';
    protected $primaryKey = ['job_id', 'category_id'];

    protected $fillable = [
        'job_id',
        'category_id',
    ];

}
