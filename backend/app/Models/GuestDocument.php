<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class GuestDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'guest_id',
        'booking_id',
        'document_type',
        'disk',
        'file_path',
        'original_name',
        'mime_type',
        'file_size',
        'sha256_hash',
        'verification_status',
        'verified_by_user_id',
        'verified_at',
        'rejection_reason',
    ];

    protected $hidden = [
        'file_path',
        'sha256_hash',
    ];

    protected $casts = [
        'file_size' => 'integer',

        'verified_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(
            Guest::class
        );
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(
            Booking::class
        );
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'verified_by_user_id'
        );
    }
}