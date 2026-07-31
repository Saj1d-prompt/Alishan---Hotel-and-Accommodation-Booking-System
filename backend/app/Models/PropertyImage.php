<?php

namespace App\Models;

use App\Enums\ImageCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PropertyImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'property_id',
        'file_name',
        'disk',
        'mime_type',
        'file_size',
        'width',
        'height',
        'alt_text',
        'caption',
        'category',
        'is_cover',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'file_size'  => 'integer',
        'width'      => 'integer',
        'height'     => 'integer',
        'is_cover'   => 'boolean',
        'sort_order' => 'integer',
        'status'     => 'boolean',
        'category'   => ImageCategory::class,
    ];

    /**
     * Property that owns this image.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}