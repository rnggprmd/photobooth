<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhotoResultItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'result_id',
        'session_photo_id',
        'template_photo_slot_id',
        'crop_config_json',
    ];

    protected $casts = [
        'crop_config_json' => 'array',
    ];

    public function result()
    {
        return $this->belongsTo(PhotoResult::class, 'result_id');
    }

    public function sessionPhoto()
    {
        return $this->belongsTo(SessionPhoto::class);
    }

    public function templatePhotoSlot()
    {
        return $this->belongsTo(TemplatePhotoSlot::class);
    }
}
