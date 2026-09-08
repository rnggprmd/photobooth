<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoSession extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'event_id',
        'customer_id',
        'operator_id',
        'mode',
        'session_token',
        'status',
        'selected_template_version_id',
        'retake_count',
        'started_at',
        'completed_at',
        'expires_at',
    ];

    protected $casts = [
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
        'expires_at'   => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function selectedTemplateVersion()
    {
        return $this->belongsTo(TemplateVersion::class, 'selected_template_version_id');
    }

    public function photos()
    {
        return $this->hasMany(SessionPhoto::class, 'session_id')->orderBy('capture_order');
    }

    public function activePhotos()
    {
        return $this->hasMany(SessionPhoto::class, 'session_id')
                    ->where('status', 'active')
                    ->orderBy('capture_order');
    }

    public function results()
    {
        return $this->hasMany(PhotoResult::class, 'session_id');
    }

    public function latestResult()
    {
        return $this->hasOne(PhotoResult::class, 'session_id')->latestOfMany();
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeOnsite($query)
    {
        return $query->where('mode', 'onsite');
    }

    public function scopeOnline($query)
    {
        return $query->where('mode', 'online');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isExpired(): bool
    {
        return $this->status === 'expired' || ($this->expires_at && $this->expires_at->isPast());
    }
}
