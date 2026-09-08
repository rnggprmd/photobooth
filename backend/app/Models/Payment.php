<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'provider',
        'method',
        'amount',
        'external_reference',
        'status',
        'paid_at',
        'raw_response_json',
    ];

    protected $casts = [
        'amount'            => 'decimal:2',
        'paid_at'           => 'datetime',
        'raw_response_json' => 'array',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
