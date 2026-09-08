<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'version_number',
        'design_media_id',
        'preview_media_id',
        'canvas_width',
        'canvas_height',
        'status',
        'created_by',
    ];

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function designMedia()
    {
        return $this->belongsTo(MediaFile::class, 'design_media_id');
    }

    public function previewMedia()
    {
        return $this->belongsTo(MediaFile::class, 'preview_media_id');
    }

    public function photoSlots()
    {
        return $this->hasMany(TemplatePhotoSlot::class)->orderBy('slot_order');
    }

    public function slots()
    {
        return $this->hasMany(TemplatePhotoSlot::class)->orderBy('slot_order');
    }

    public function elements()
    {
        return $this->hasMany(TemplateElement::class)->orderBy('z_index');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function photoSessions()
    {
        return $this->hasMany(PhotoSession::class, 'selected_template_version_id');
    }

    public function photoResults()
    {
        return $this->hasMany(PhotoResult::class);
    }
}
