<?php

namespace App\Http\Requests\Admin;

use App\Models\Booking;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ApproveBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_uuid' => [
                'required',
                'uuid',

                Rule::exists(
                    'rooms',
                    'uuid'
                ),
            ],

            'payment_plan' => [
                'required',

                Rule::in([
                    'full',
                    'partial',
                ]),
            ],

            'amount_due_now' => [
                'nullable',
                'required_if:payment_plan,partial',
                'numeric',
                'min:0.01',
            ],

            /*
             * Admin selects dates rather than
             * timezone-sensitive local times.
             *
             * Backend converts these to the end
             * of that day in Europe/Vilnius.
             */
            'payment_due_at' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:today',
            ],

            'remaining_due_at' => [
                'nullable',
                'required_if:payment_plan,partial',
                'date_format:Y-m-d',
                'after:payment_due_at',
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (
                Validator $validator
            ): void {
                $booking =
                    $this->route(
                        'booking'
                    );

                if (
                    ! $booking
                    instanceof Booking
                ) {
                    return;
                }

                $systemTotal =
                    round(
                        (float)
                        $booking
                            ->estimated_total_amount,
                        2
                    );

                if (
                    $systemTotal <= 0
                ) {
                    $validator
                        ->errors()
                        ->add(
                            'payment_plan',
                            'The booking does not have a valid system-calculated total.'
                        );

                    return;
                }

                if (
                    $this->input(
                        'payment_plan'
                    ) !== 'partial'
                ) {
                    return;
                }

                $amountDueNow =
                    round(
                        (float)
                        $this->input(
                            'amount_due_now'
                        ),
                        2
                    );

                if (
                    $amountDueNow
                    >= $systemTotal
                ) {
                    $validator
                        ->errors()
                        ->add(
                            'amount_due_now',
                            'For a partial payment, the amount due now must be less than the full booking total.'
                        );
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'remaining_due_at.required_if' =>
                'Select when the remaining balance will be due.',

            'remaining_due_at.after' =>
                'The remaining balance date must be after the first payment deadline.',
        ];
    }
}