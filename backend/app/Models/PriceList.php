<?php

namespace App\Models;

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
        'contract_id',
        'room_id',
        'bed_id',
        'price',
        'currency',
        'effective_from',
        'effective_until',
        'display_order',
        'status',
    ];

    protected $casts = [
        'price'           => 'decimal:2',
        'effective_from'  => 'date',
        'effective_until' => 'date',
        'display_order'   => 'integer',
        'status'          => 'boolean',
        'currency'        => Currency::class,
    ];

    /**
     * Contract associated with this price.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Room associated with this price.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Bed associated with this price (nullable).
     */
    public function bed(): BelongsTo
    {
        return $this->belongsTo(Bed::class);
    }
}