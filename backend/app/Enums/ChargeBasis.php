<?php

namespace App\Enums;

enum ChargeBasis: string
{
    case PER_PERSON = 'per_person';

    public function label(): string
    {
        return match ($this) {
            self::PER_PERSON => 'Per person',
        };
    }
}