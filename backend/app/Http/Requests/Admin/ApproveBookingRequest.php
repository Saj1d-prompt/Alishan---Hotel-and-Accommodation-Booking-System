<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

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
                'exists:rooms,uuid',
            ],

            /*
             * Until the client gives us the exact
             * long-term payment rule, Admin controls
             * the approved amount.
             */
            'payable_amount' => [
                'required',
                'numeric',
                'min:0.01',
                'max:99999999.99',
            ],

            'payment_due_at' => [
                'required',
                'date',
                'after:now',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'room_uuid.required' =>
                'Please select the physical room to assign.',

            'payable_amount.required' =>
                'Please enter the amount that the customer must pay.',

            'payment_due_at.required' =>
                'Please select the payment deadline.',

            'payment_due_at.after' =>
                'The payment deadline must be in the future.',
        ];
    }
}