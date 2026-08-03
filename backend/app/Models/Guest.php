<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'guest_code',
        'first_name',
        'last_name',
        'phone',
        'email',
        'date_of_birth',
        'gender',
        'nationality',
        'document_type',
        'document_number',
        'document_expiry_date',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'notes',
        'status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'document_expiry_date' => 'date',
        'status' => 'boolean',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim(
            collect([
                $this->first_name,
                $this->last_name,
            ])
                ->filter()
                ->implode(' ')
        );
    }
}