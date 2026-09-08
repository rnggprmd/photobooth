<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'status',
        'logo_media_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // -------------------------------------------------------------------------
    // Relations
    // -------------------------------------------------------------------------

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function businessProfile()
    {
        return $this->hasOne(BusinessProfile::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(TenantSubscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(TenantSubscription::class)->whereIn('status', ['active', 'trial'])->latestOfMany();
    }

    public function packages()
    {
        return $this->hasMany(Package::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function templates()
    {
        return $this->hasMany(Template::class);
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function photoSessions()
    {
        return $this->hasMany(PhotoSession::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function mediaFiles()
    {
        return $this->hasMany(MediaFile::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function logo()
    {
        return $this->belongsTo(MediaFile::class, 'logo_media_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }
}
