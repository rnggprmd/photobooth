<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'capture_order',
        'media_id',
        'status',
        'retake_of_id',
        'captured_at',
    ];

    protected $casts = [
        'captured_at' => 'datetime',
    ];

    public function session()
    {
        return $this->belongsTo(PhotoSession::class, 'session_id');
    }

    public function media()
    {
        return $this->belongsTo(MediaFile::class, 'media_id');
    }

    public function retakeOf()
    {
        return $this->belongsTo(SessionPhoto::class, 'retake_of_id');
    }

    public function retakes()
    {
        return $this->hasMany(SessionPhoto::class, 'retake_of_id');
    }

    public function photoResultItems()
    {
        return $this->hasMany(PhotoResultItem::class);
    }
}
