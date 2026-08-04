<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

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

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'display_order' => 'integer',
        'status' => 'boolean',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)
            ->orderBy('sort_order');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class)
            ->orderBy('display_order');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function propertyContracts(): HasMany
    {
        return $this->hasMany(PropertyContract::class);
    }

    public function contracts(): BelongsToMany
    {
        return $this->belongsToMany(
            Contract::class,
            'property_contracts'
        )
            ->withPivot([
                'allowed_floors',
                'status',
            ])
            ->withTimestamps();
    }
}