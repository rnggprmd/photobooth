<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory, BelongsToTenant, HasAuditLog;

    protected $fillable = [
        'tenant_id',
        'package_id',
        'name',
        'description',
        'event_date',
        'start_time',
        'end_time',
        'location',
        'status',
        'online_slug',
        'online_access_token',
        'online_enabled',
    ];

    protected $casts = [
        'event_date'     => 'date',
        'online_enabled' => 'boolean',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function operators()
    {
        return $this->belongsToMany(User::class, 'event_operators', 'event_id', 'user_id')
                    ->withPivot('assigned_at');
    }

    public function templates()
    {
        return $this->belongsToMany(Template::class, 'event_templates')
                    ->withPivot(['is_default', 'sort_order'])
                    ->orderByPivot('sort_order');
    }

    public function photoSessions()
    {
        return $this->hasMany(PhotoSession::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->toDateString())
                     ->whereIn('status', ['scheduled', 'active']);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isOnlineEnabled(): bool
    {
        return $this->online_enabled && ! empty($this->online_slug);
    }
}
