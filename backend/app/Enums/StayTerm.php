<?php

namespace App\Enums;

use InvalidArgumentException;

enum StayTerm: string
{
    case SHORT_TERM = 'short_term';
    case LONG_TERM = 'long_term';

    public function contractCode(): string
    {
        return match ($this) {
            self::SHORT_TERM => 'SHORT_TERM',
            self::LONG_TERM => 'LONG_TERM',
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::SHORT_TERM => 'Short Term',
            self::LONG_TERM => 'Long Term',
        };
    }

    public static function fromContractCode(string $code): self
    {
        return match (strtoupper($code)) {
            'SHORT_TERM' => self::SHORT_TERM,
            'LONG_TERM' => self::LONG_TERM,

            default => throw new InvalidArgumentException(
                "Unsupported contract code: {$code}"
            ),
        };
    }
}