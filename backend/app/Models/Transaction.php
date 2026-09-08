<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'customer_id',
        'package_id',
        'event_id',
        'tenant_subscription_id',
        'type',
        'invoice_number',
        'amount',
        'currency',
        'status',
        'transaction_date',
        'due_at',
    ];

    protected $casts = [
        'amount'           => 'decimal:2',
        'transaction_date' => 'datetime',
        'due_at'           => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function tenantSubscription()
    {
        return $this->belongsTo(TenantSubscription::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
