<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaymentInstallment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public Payment $payment,
        public PaymentInstallment $installment,
        public string $statusUrl
    ) {
        $this->afterCommit();
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $booking = $this->booking->fresh([
            'guest',
            'property',
            'paymentInstallments',
        ]) ?? $this->booking;

        $payment = $this->payment->fresh()
            ?? $this->payment;

        $installment = $this->installment->fresh()
            ?? $this->installment;

        $installments = $booking
            ->paymentInstallments
            ->sortBy('installment_number')
            ->values();

        $bookingTotal = round(
            (float) (
                $booking->total_amount
                ?? $booking->estimated_total_amount
                ?? 0
            ),
            2
        );

        $totalPaid = round(
            (float) $installments->sum(
                fn (PaymentInstallment $item) =>
                    (float) $item->paid_amount
            ),
            2
        );

        $remaining = max(
            round(
                $bookingTotal - $totalPaid,
                2
            ),
            0
        );

        $receivedAmount = round(
            (float) $payment->amount,
            2
        );

        $isPartialPlan =
            $installments->count() > 1;

        $isFullyPaid =
            $remaining <= 0.009;

        $nextInstallment = $installments->first(
            fn (PaymentInstallment $item) =>
                $item->status === 'pending'
                &&
                (
                    (float) $item->amount
                    -
                    (float) $item->paid_amount
                ) > 0.009
        );

        $subject = $isFullyPaid
            ? (
                $isPartialPlan
                    ? 'Final payment received for your Alishan booking'
                    : 'Payment received for your Alishan booking'
            )
            : 'Payment received - your Alishan booking is confirmed';

        $message = (new MailMessage)
            ->subject($subject)
            ->greeting(
                'Hello '
                . $booking->guest->full_name
                . ','
            )
            ->line(
                'We have successfully received your accommodation payment.'
            )
            ->line(
                'Booking reference: '
                . $booking->booking_reference
            )
            ->line(
                'Location: '
                . $booking->property->name
            )
            ->line(
                'Payment received: '
                . $this->formatAmount(
                    $receivedAmount
                )
            )
            ->line(
                'Payment item: '
                . $installment->label
            )
            ->line(
                'Payment reference: '
                . $payment->payment_reference
            )
            ->line(
                'Total paid so far: '
                . $this->formatAmount(
                    $totalPaid
                )
            );

        /*
         * Partial-payment plan:
         * first installment has been received,
         * but a balance remains.
         */
        if (! $isFullyPaid) {
            $message
                ->line(
                    'Your required initial payment has been received, so your booking is now confirmed.'
                )
                ->line(
                    'Remaining balance: '
                    . $this->formatAmount(
                        $remaining
                    )
                );

            if ($nextInstallment?->due_at) {
                $message->line(
                    'Remaining payment deadline: '
                    . $this->formatDeadline(
                        $nextInstallment->due_at
                    )
                );
            }

            return $message
                ->action(
                    'View Booking & Pay Remaining Balance',
                    $this->statusUrl
                )
                ->line(
                    'We will also send you a reminder approximately 24 hours before the remaining payment deadline if the balance is still unpaid.'
                )
                ->line(
                    'For security, card details and passport information are never included in email messages.'
                )
                ->salutation(
                    'Alishan Accommodation'
                );
        }

        /*
         * Full payment or final installment.
         */
        return $message
            ->line(
                'Booking total: '
                . $this->formatAmount(
                    $bookingTotal
                )
            )
            ->line(
                'Remaining balance: €0.00'
            )
            ->line(
                'Your booking is confirmed and fully paid.'
            )
            ->action(
                'View Booking Status',
                $this->statusUrl
            )
            ->line(
                'For security, card details and passport information are never included in email messages.'
            )
            ->salutation(
                'Alishan Accommodation'
            );
    }

    private function formatAmount(
        float $amount
    ): string {
        return '€'
            . number_format(
                $amount,
                2,
                '.',
                ''
            );
    }

    private function formatDeadline(
        $date
    ): string {
        return $date
            ->copy()
            ->timezone(
                config(
                    'alishan.timezone',
                    'Europe/Vilnius'
                )
            )
            ->format(
                'd M Y, H:i T'
            );
    }
}