<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGatewayEvent extends Model
{
    protected $fillable = [
        'gateway',
        'event_id',
        'event_type',
        'status',
        'payload_hash',
        'processed_at',
        'error_message',
    ];

    protected $casts = [
        'processed_at' =>
            'datetime',
    ];
}