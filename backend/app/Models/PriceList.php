<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PriceList extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'effective_from' => 'date',
        'effective_until' => 'date',
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the contract for this price.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the room for this price.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the bed for this price.
     */
    public function bed(): BelongsTo
    {
        return $this->belongsTo(Bed::class);
    }
}