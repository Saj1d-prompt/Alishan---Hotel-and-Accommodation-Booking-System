<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentInstallment extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'booking_id',
        'installment_number',
        'label',
        'amount',
        'paid_amount',
        'due_at',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'installment_number' =>
            'integer',

        'amount' =>
            'decimal:2',

        'paid_amount' =>
            'decimal:2',

        'due_at' =>
            'datetime',

        'paid_at' =>
            'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(
            Booking::class
        );
    }

    public function payments(): HasMany
    {
        return $this->hasMany(
            Payment::class,
            'payment_installment_id'
        );
    }
}