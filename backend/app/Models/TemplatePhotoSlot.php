<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplatePhotoSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_version_id',
        'slot_key',
        'slot_order',
        'position_x',
        'position_y',
        'width',
        'height',
        'rotation',
        'crop_mode',
        'mask_type',
        'mask_config_json',
    ];

    protected $casts = [
        'mask_config_json' => 'array',
        'position_x'       => 'float',
        'position_y'       => 'float',
        'width'            => 'float',
        'height'           => 'float',
        'rotation'         => 'float',
    ];

    public function templateVersion()
    {
        return $this->belongsTo(TemplateVersion::class);
    }

    public function photoResultItems()
    {
        return $this->hasMany(PhotoResultItem::class);
    }
}
