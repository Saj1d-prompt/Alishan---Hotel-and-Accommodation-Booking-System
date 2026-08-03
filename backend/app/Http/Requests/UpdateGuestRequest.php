<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGuestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $guest = $this->route('guest');

        return [
            'first_name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'last_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'phone' => [
                'sometimes',
                'required',
                'string',
                'max:30',
            ],

            'email' => [
                'nullable',
                'email:rfc',
                'max:255',
            ],

            'date_of_birth' => [
                'nullable',
                'date',
                'before:today',
            ],

            'gender' => [
                'nullable',
                Rule::in([
                    'male',
                    'female',
                    'other',
                ]),
            ],

            'nationality' => [
                'nullable',
                'string',
                'max:100',
            ],

            'document_type' => [
                'sometimes',
                'required',
                Rule::in([
                    'passport',
                    'residence_permit',
                    'other',
                ]),
            ],

            'document_number' => [
                'sometimes',
                'required',
                'string',
                'max:100',

                Rule::unique('guests', 'document_number')
                    ->ignore($guest),
            ],

            'document_expiry_date' => [
                'nullable',
                'date',
            ],

            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'emergency_contact_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'emergency_contact_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'status' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
}