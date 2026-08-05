<?php

namespace App\Support;

final class PassportNumber
{
    public static function normalize(
        string $value
    ): string {
        $normalized = preg_replace(
            '/\s+/',
            '',
            trim($value)
        );

        return mb_strtoupper(
            $normalized ?? '',
            'UTF-8'
        );
    }

    public static function hash(
        string $value
    ): string {
        return hash_hmac(
            'sha256',
            self::normalize($value),
            (string) config('app.key')
        );
    }

    public static function mask(
        ?string $value
    ): ?string {
        if (! $value) {
            return null;
        }

        $normalized =
            self::normalize($value);

        $visibleCharacters = min(
            4,
            mb_strlen($normalized)
        );

        $hiddenCharacters = max(
            0,
            mb_strlen($normalized)
                - $visibleCharacters
        );

        return str_repeat(
            '•',
            $hiddenCharacters
        ) . mb_substr(
            $normalized,
            -$visibleCharacters
        );
    }
}