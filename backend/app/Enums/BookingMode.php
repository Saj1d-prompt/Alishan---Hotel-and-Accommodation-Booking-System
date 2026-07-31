<?php

namespace App\Enums;

enum BookingMode: string
{
    case ROOM = 'room';
    case BED = 'bed';
    case BOTH = 'both';
}