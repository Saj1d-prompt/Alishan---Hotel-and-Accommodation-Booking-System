<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'room_type_id',
        'room_id',
        'bed_id',
        'contract_id',
        'price_list_id',
        'unit_price',
        'billing_unit',
        'charge_basis',
        'occupant_count',
        'duration_units',
        'subtotal',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',

        'occupant_count' => 'integer',

        'duration_units' => 'integer',

        'subtotal' => 'decimal:2',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(
            Booking::class
        );
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(
            RoomType::class
        );
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(
            Room::class
        );
    }

    public function bed(): BelongsTo
    {
        return $this->belongsTo(
            Bed::class
        );
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(
            Contract::class
        );
    }

    public function priceList(): BelongsTo
    {
        return $this->belongsTo(
            PriceList::class
        );
    }
}