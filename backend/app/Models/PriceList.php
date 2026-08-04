<?php

namespace App\Models;

use App\Enums\ChargeBasis;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PriceList extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'property_contract_id',
        'room_type_id',
        'price',
        'currency',
        'charge_basis',
        'utilities_included',
        'effective_from',
        'effective_until',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',

        'currency' => Currency::class,

        'charge_basis' => ChargeBasis::class,

        'utilities_included' => 'boolean',

        'effective_from' => 'date',

        'effective_until' => 'date',

        'status' => 'boolean',
    ];

    public function propertyContract(): BelongsTo
    {
        return $this->belongsTo(
            PropertyContract::class
        );
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(
            RoomType::class
        );
    }
}