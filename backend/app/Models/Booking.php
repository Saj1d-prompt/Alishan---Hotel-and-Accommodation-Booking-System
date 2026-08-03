<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'booking_reference',
        'guest_id',
        'property_id',
        'created_by_user_id',
        'reviewed_by_user_id',
        'guest_count',
        'check_in_date',
        'check_out_date',
        'total_amount',
        'currency',
        'booking_status',
        'source',
        'reviewed_at',
        'rejection_reason',
        'payment_due_at',
        'confirmed_at',
        'cancelled_at',
        'notes',
    ];

    protected $casts = [
        'guest_count' => 'integer',
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_amount' => 'decimal:2',
        'currency' => Currency::class,
        'booking_status' => BookingStatus::class,
        'reviewed_at' => 'datetime',
        'payment_due_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by_user_id'
        );
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'reviewed_by_user_id'
        );
    }

    public function items(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}