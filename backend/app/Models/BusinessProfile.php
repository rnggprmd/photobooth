<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessProfile extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'business_name',
        'description',
        'email',
        'phone',
        'address',
        'logo_media_id',
        'branding_json',
        'social_media_json',
        'photobooth_settings_json',
    ];

    protected $casts = [
        'branding_json'           => 'array',
        'social_media_json'       => 'array',
        'photobooth_settings_json' => 'array',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function logo()
    {
        return $this->belongsTo(MediaFile::class, 'logo_media_id');
    }
}
