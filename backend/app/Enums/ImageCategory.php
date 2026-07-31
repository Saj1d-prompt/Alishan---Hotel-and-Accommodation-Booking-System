<?php

namespace App\Enums;

enum ImageCategory: string
{
    case EXTERIOR = 'exterior';
    case RECEPTION = 'reception';
    case BEDROOM = 'bedroom';
    case BATHROOM = 'bathroom';
    case KITCHEN = 'kitchen';
    case COMMON_AREA = 'common_area';
    case OTHER = 'other';
}