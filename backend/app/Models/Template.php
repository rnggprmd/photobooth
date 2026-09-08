<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory, BelongsToTenant, HasAuditLog;

    protected $fillable = [
        'tenant_id',
        'name',
        'paper_size',
        'orientation',
        'canvas_width',
        'canvas_height',
        'status',
        'current_version_id',
        'preview_media_id',
    ];

    protected $casts = [
        'canvas_width'  => 'integer',
        'canvas_height' => 'integer',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function versions()
    {
        return $this->hasMany(TemplateVersion::class);
    }

    public function currentVersion()
    {
        return $this->belongsTo(TemplateVersion::class, 'current_version_id');
    }

    public function preview()
    {
        return $this->belongsTo(MediaFile::class, 'preview_media_id');
    }

    public function previewMedia()
    {
        return $this->belongsTo(MediaFile::class, 'preview_media_id');
    }

    public function packages()
    {
        return $this->belongsToMany(Package::class, 'package_templates');
    }

    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_templates')
                    ->withPivot(['is_default', 'sort_order']);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
