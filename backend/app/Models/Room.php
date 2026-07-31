<?php

namespace App\Models;

use App\Enums\BookingMode;
use App\Enums\Gender;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'property_id',
        'room_type_id',
        'room_number',
        'floor',
        'capacity',
        'gender',
        'booking_mode',
        'description',
        'display_order',
        'status',
    ];

    protected $casts = [
        'capacity'      => 'integer',
        'display_order' => 'integer',
        'gender'        => Gender::class,
        'booking_mode'  => BookingMode::class,
        'status'        => 'boolean',
    ];

    /**
     * Property that owns this room.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Room type.
     */
    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    /**
     * Beds inside the room.
     */
    public function beds(): HasMany
    {
        return $this->hasMany(Bed::class)
            ->orderBy('display_order');
    }

    /**
     * Pricing for this room.
     */
    public function priceLists(): HasMany
    {
        return $this->hasMany(PriceList::class);
    }

    /**
     * Booking items.
     */
    public function bookingItems(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }
}