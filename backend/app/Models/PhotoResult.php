<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'template_version_id',
        'final_media_id',
        'result_token',
        'qr_payload',
        'status',
        'generated_at',
        'expires_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'expires_at'   => 'datetime',
    ];

    public function session()
    {
        return $this->belongsTo(PhotoSession::class, 'session_id');
    }

    public function photoSession()
    {
        return $this->belongsTo(PhotoSession::class, 'session_id');
    }

    public function templateVersion()
    {
        return $this->belongsTo(TemplateVersion::class);
    }

    public function finalMedia()
    {
        return $this->belongsTo(MediaFile::class, 'final_media_id');
    }

    public function compositeMedia()
    {
        return $this->belongsTo(MediaFile::class, 'final_media_id');
    }

    public function qrMedia()
    {
        return $this->belongsTo(MediaFile::class, 'final_media_id');
    }

    public function items()
    {
        return $this->hasMany(PhotoResultItem::class, 'result_id');
    }

    public function isReady(): bool
    {
        return $this->status === 'ready';
    }

    public function isExpired(): bool
    {
        return $this->status === 'expired' || ($this->expires_at && $this->expires_at->isPast());
    }
}
