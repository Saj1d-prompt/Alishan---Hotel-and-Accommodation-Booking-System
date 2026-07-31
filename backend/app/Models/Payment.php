<?php

namespace App\Models;

use App\Enums\Currency;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'booking_id',
        'payment_reference',
        'gateway',
        'transaction_id',
        'amount',
        'currency',
        'payment_status',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'currency' => Currency::class,
        'payment_status' => PaymentStatus::class,
        'paid_at' => 'datetime',
    ];

    /**
     * Booking associated with this payment.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}