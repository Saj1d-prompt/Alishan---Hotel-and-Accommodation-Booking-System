<?php

namespace App\Enums;

enum BookingStatus: string
{
    case PENDING_REVIEW = 'pending_review';

    case AWAITING_PAYMENT = 'awaiting_payment';

    case CONFIRMED = 'confirmed';

    case REJECTED = 'rejected';

    case PAYMENT_EXPIRED = 'payment_expired';

    case CANCELLED = 'cancelled';

    case CHECKED_IN = 'checked_in';

    case CHECKED_OUT = 'checked_out';
}