<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'booking_reference',
        'guest_id',
        'property_id',
        'created_by_user_id',
        'reviewed_by_user_id',
        'guest_count',
        'check_in_date',
        'check_out_date',
        'estimated_total_amount',
        'total_amount',
        'currency',
        'booking_status',
        'source',
        'public_access_token_hash',
        'public_access_token',
        'submitted_at',
        'privacy_accepted_at',
        'reviewed_at',
        'rejection_reason',
        'payment_due_at',
        'confirmed_at',
        'cancelled_at',
        'notes',
    ];

    protected $hidden = [
        'public_access_token_hash',
        'public_access_token',
    ];

    protected $casts = [
        'guest_count' => 'integer',

        'check_in_date' => 'date',
        'check_out_date' => 'date',

        'estimated_total_amount' =>
        'decimal:2',

        'total_amount' =>
        'decimal:2',

        'currency' =>
        Currency::class,

        'booking_status' =>
        BookingStatus::class,

        'public_access_token' =>
        'encrypted',

        'submitted_at' =>
        'datetime',

        'privacy_accepted_at' =>
        'datetime',

        'reviewed_at' =>
        'datetime',

        'payment_due_at' =>
        'datetime',

        'confirmed_at' =>
        'datetime',

        'cancelled_at' =>
        'datetime',
    ];
    public function guest(): BelongsTo
    {
        return $this->belongsTo(
            Guest::class
        );
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(
            Property::class
        );
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by_user_id'
        );
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'reviewed_by_user_id'
        );
    }

    public function items(): HasMany
    {
        return $this->hasMany(
            BookingItem::class
        );
    }

    public function documents(): HasMany
    {
        return $this->hasMany(
            GuestDocument::class
        );
    }

    public function payments(): HasMany
    {
        return $this->hasMany(
            Payment::class
        );
    }
    public function paymentInstallments(): HasMany
    {
        return $this
            ->hasMany(
                PaymentInstallment::class
            )
            ->orderBy(
                'installment_number'
            );
    }

    public function financialSummary(): array
    {
        $installments =
            $this->relationLoaded(
                'paymentInstallments'
            )
            ? $this
            ->paymentInstallments
            : $this
            ->paymentInstallments()
            ->get();

        $bookingTotal =
            round(
                (float) (
                    $this->total_amount
                    ?? $this
                    ->estimated_total_amount
                    ?? 0
                ),
                2
            );

        $paidAmount =
            round(
                (float)
                $installments->sum(
                    fn(
                        PaymentInstallment
                        $installment
                    ) =>
                    (float)
                    $installment
                        ->paid_amount
                ),
                2
            );

        $outstandingAmount =
            max(
                round(
                    $bookingTotal
                        - $paidAmount,
                    2
                ),
                0
            );

        $pendingInstallments =
            $installments
            ->filter(
                function (
                    PaymentInstallment
                    $installment
                ) {
                    $remaining =
                        (float)
                        $installment
                            ->amount
                        -
                        (float)
                        $installment
                            ->paid_amount;

                    return
                        $installment
                        ->status
                        === 'pending'
                        && $remaining > 0.009;
                }
            )
            ->sortBy(
                'installment_number'
            )
            ->values();

        $hasOverdueInstallment =
            $pendingInstallments
            ->contains(
                fn(
                    PaymentInstallment
                    $installment
                ) =>
                $installment
                    ->due_at
                    &&
                    $installment
                    ->due_at
                    ->isPast()
            );

        if (
            $bookingTotal > 0
            && $outstandingAmount <= 0.009
        ) {
            $paymentStatus =
                'paid';
        } elseif (
            $hasOverdueInstallment
        ) {
            $paymentStatus =
                'overdue';
        } elseif (
            $paidAmount > 0
        ) {
            $paymentStatus =
                'partially_paid';
        } else {
            $paymentStatus =
                'unpaid';
        }

        $nextInstallment =
            $pendingInstallments
            ->first();

        $nextInstallmentData =
            null;

        if ($nextInstallment) {
            $amountRemaining =
                max(
                    round(
                        (float)
                        $nextInstallment
                            ->amount
                            -
                            (float)
                            $nextInstallment
                                ->paid_amount,
                        2
                    ),
                    0
                );

            $nextInstallmentData = [
                'uuid' =>
                $nextInstallment
                    ->uuid,

                'installment_number' =>
                $nextInstallment
                    ->installment_number,

                'label' =>
                $nextInstallment
                    ->label,

                'amount' =>
                (string)
                $nextInstallment
                    ->amount,

                'paid_amount' =>
                (string)
                $nextInstallment
                    ->paid_amount,

                'amount_remaining' =>
                number_format(
                    $amountRemaining,
                    2,
                    '.',
                    ''
                ),

                'due_at' =>
                $nextInstallment
                    ->due_at
                    ?->toIso8601String(),

                'status' =>
                $nextInstallment
                    ->status,
            ];
        }

        $remainingAfterNextPayment =
            $outstandingAmount;

        if ($nextInstallmentData) {
            $remainingAfterNextPayment =
                max(
                    round(
                        $outstandingAmount
                            -
                            (float)
                            $nextInstallmentData['amount_remaining'],
                        2
                    ),
                    0
                );
        }

        return [
            'booking_total_amount' =>
            number_format(
                $bookingTotal,
                2,
                '.',
                ''
            ),

            'paid_amount' =>
            number_format(
                $paidAmount,
                2,
                '.',
                ''
            ),

            'outstanding_amount' =>
            number_format(
                $outstandingAmount,
                2,
                '.',
                ''
            ),

            'remaining_after_next_payment' =>
            number_format(
                $remainingAfterNextPayment,
                2,
                '.',
                ''
            ),

            'payment_status' =>
            $paymentStatus,

            'next_installment' =>
            $nextInstallmentData,

            'installments' =>
            $installments
                ->map(
                    function (
                        PaymentInstallment
                        $installment
                    ) {
                        $remaining =
                            max(
                                round(
                                    (float)
                                    $installment
                                        ->amount
                                        -
                                        (float)
                                        $installment
                                            ->paid_amount,
                                    2
                                ),
                                0
                            );

                        return [
                            'uuid' =>
                            $installment
                                ->uuid,

                            'installment_number' =>
                            $installment
                                ->installment_number,

                            'label' =>
                            $installment
                                ->label,

                            'amount' =>
                            (string)
                            $installment
                                ->amount,

                            'paid_amount' =>
                            (string)
                            $installment
                                ->paid_amount,

                            'amount_remaining' =>
                            number_format(
                                $remaining,
                                2,
                                '.',
                                ''
                            ),

                            'due_at' =>
                            $installment
                                ->due_at
                                ?->toIso8601String(),

                            'status' =>
                            $installment
                                ->status,

                            'paid_at' =>
                            $installment
                                ->paid_at
                                ?->toIso8601String(),
                        ];
                    }
                )
                ->values()
                ->all(),
        ];
    }
}
