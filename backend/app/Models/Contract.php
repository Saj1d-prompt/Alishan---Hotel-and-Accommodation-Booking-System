<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'duration_months',
        'description',
        'display_order',
        'status',
    ];

    protected $casts = [
        'duration_months' => 'integer',
        'display_order' => 'integer',
        'status' => 'boolean',
    ];

    public function priceLists(): HasMany
    {
        return $this->hasMany(PriceList::class);
    }
}