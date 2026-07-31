<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomType extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'description',
        'default_capacity',
        'display_order',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'default_capacity' => 'integer',
        'display_order' => 'integer',
        'status' => 'boolean',
    ];

    /**
     * Get all rooms of this room type.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }
}