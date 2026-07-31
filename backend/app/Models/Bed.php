<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bed extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'room_id',
        'bed_number',
        'description',
        'display_order',
        'status',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'status' => 'boolean',
    ];

    /**
     * Get the room that owns this bed.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}