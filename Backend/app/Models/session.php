<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class session extends Model
{
    use HasFactory;

    protected $table = 'sessions' ;

    protected $primaryKey = ['id','user_id'];

    protected $fillable = [
        'id',
        'user_id',
        'ip_address',
        'user_agent',
        'payload',
        'last_activity',
    ];



}
