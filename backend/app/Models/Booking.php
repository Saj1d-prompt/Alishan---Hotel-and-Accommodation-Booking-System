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
        'estimated_total_amount',
        'total_amount',
        'currency',
        'booking_status',
        'source',
        'public_access_token_hash',
        'public_access_token',
        'submitted_at',
        'privacy_accepted_at',
        'reviewed_at',
        'rejection_reason',
        'payment_due_at',
        'confirmed_at',
        'cancelled_at',
        'notes',
    ];

    protected $hidden = [
        'public_access_token_hash',
        'public_access_token',
    ];

    protected $casts = [
        'guest_count' => 'integer',

        'check_in_date' => 'date',
        'check_out_date' => 'date',

        'estimated_total_amount' =>
        'decimal:2',

        'total_amount' =>
        'decimal:2',

        'currency' =>
        Currency::class,

        'booking_status' =>
        BookingStatus::class,

        'public_access_token' =>
        'encrypted',

        'submitted_at' =>
        'datetime',

        'privacy_accepted_at' =>
        'datetime',

        'reviewed_at' =>
        'datetime',

        'payment_due_at' =>
        'datetime',

        'confirmed_at' =>
        'datetime',

        'cancelled_at' =>
        'datetime',
    ];
    public function guest(): BelongsTo
    {
        return $this->belongsTo(
            Guest::class
        );
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(
            Property::class
        );
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
        return $this->hasMany(
            BookingItem::class
        );
    }

    public function documents(): HasMany
    {
        return $this->hasMany(
            GuestDocument::class
        );
    }

    public function payments(): HasMany
    {
        return $this->hasMany(
            Payment::class
        );
    }
}
