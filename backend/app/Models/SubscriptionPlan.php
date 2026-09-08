<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_period',
        'max_events',
        'max_sessions',
        'max_templates',
        'max_storage_mb',
        'max_operators',
        'max_customers',
        'features_json',
        'status',
    ];

    protected $casts = [
        'price'         => 'decimal:2',
        'features_json' => 'array',
    ];

    public function tenantSubscriptions()
    {
        return $this->hasMany(TenantSubscription::class, 'plan_id');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
