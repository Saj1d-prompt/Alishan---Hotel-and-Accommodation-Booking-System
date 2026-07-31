<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'city_id',
        'name',
        'slug',
        'address',
        'postcode',
        'latitude',
        'longitude',
        'short_description',
        'description',
        'check_in_time',
        'check_out_time',
        'display_order',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'status' => 'boolean',
    ];

    /**
     * Get the city that owns the property.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
    /**
     * Get all images for this property.
     */
    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)
            ->orderBy('sort_order');
    }
}
