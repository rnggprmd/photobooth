<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_version_id',
        'element_type',
        'z_index',
        'position_x',
        'position_y',
        'width',
        'height',
        'rotation',
        'media_id',
        'config_json',
    ];

    protected $casts = [
        'config_json' => 'array',
        'position_x'  => 'float',
        'position_y'  => 'float',
        'width'       => 'float',
        'height'      => 'float',
        'rotation'    => 'float',
    ];

    public function templateVersion()
    {
        return $this->belongsTo(TemplateVersion::class);
    }

    public function media()
    {
        return $this->belongsTo(MediaFile::class, 'media_id');
    }
}
