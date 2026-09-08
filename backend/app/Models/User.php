<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'password',
        'status',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // -------------------------------------------------------------------------
    // Relations
    // -------------------------------------------------------------------------

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function assignedEvents()
    {
        return $this->belongsToMany(Event::class, 'event_operators', 'user_id', 'event_id')
                    ->withPivot('assigned_at')
                    ->withTimestamps();
    }

    public function operatedSessions()
    {
        return $this->hasMany(PhotoSession::class, 'operator_id');
    }

    public function templateVersions()
    {
        return $this->hasMany(TemplateVersion::class, 'created_by');
    }

    public function uploadedMedia()
    {
        return $this->hasMany(MediaFile::class, 'uploaded_by');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    public function isTenantAdmin(): bool
    {
        return $this->hasRole('tenant_admin');
    }

    public function isOperator(): bool
    {
        return $this->hasRole('operator');
    }
}
