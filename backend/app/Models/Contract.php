<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'code',
        'name',
        'billing_unit',
        'min_nights',
        'max_months',
        'fixed_start_month',
        'fixed_start_day',
        'fixed_end_month',
        'fixed_end_day',
        'description',
        'display_order',
        'status',
    ];

    protected $casts = [
        'min_nights' => 'integer',
        'max_months' => 'integer',
        'fixed_start_month' => 'integer',
        'fixed_start_day' => 'integer',
        'fixed_end_month' => 'integer',
        'fixed_end_day' => 'integer',
        'display_order' => 'integer',
        'status' => 'boolean',
    ];

    public function propertyContracts(): HasMany
    {
        return $this->hasMany(PropertyContract::class);
    }

    public function properties(): BelongsToMany
    {
        return $this->belongsToMany(
            Property::class,
            'property_contracts'
        )
            ->withPivot([
                'allowed_floors',
                'status',
            ])
            ->withTimestamps();
    }

    public function priceLists():HasManyThrough
    {
        return $this->hasManyThrough(
            PriceList::class,
            PropertyContract::class
        );
    }
}