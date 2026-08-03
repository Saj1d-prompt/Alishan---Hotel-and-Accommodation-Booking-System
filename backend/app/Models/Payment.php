<?php

namespace App\Models;

use App\Enums\Currency;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'booking_id',
        'payment_reference',
        'gateway',
        'gateway_session_id',
        'gateway_payment_intent_id',
        'transaction_id',
        'amount',
        'currency',
        'payment_status',
        'failure_code',
        'failure_message',
        'paid_at',
        'refunded_amount',
        'refunded_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refunded_amount' => 'decimal:2',
        'currency' => Currency::class,
        'payment_status' => PaymentStatus::class,
        'paid_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}