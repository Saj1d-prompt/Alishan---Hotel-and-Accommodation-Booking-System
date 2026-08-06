<?php

return [
    'frontend_url' => rtrim(
        env(
            'FRONTEND_URL',
            'http://localhost:5173'
        ),
        '/'
    ),

    'timezone' => env(
        'ALISHAN_TIMEZONE',
        'Europe/Vilnius'
    ),

    'support_email' => env(
        'ALISHAN_SUPPORT_EMAIL',
        'alishan@ethos24lt.com'
    ),

    'support_phone' => env(
        'ALISHAN_SUPPORT_PHONE',
        '+370 69400005'
    ),
];