<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory, BelongsToTenant, HasAuditLog;

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'price',
        'duration_minutes',
        'max_sessions',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function templates()
    {
        return $this->belongsToMany(Template::class, 'package_templates');
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
