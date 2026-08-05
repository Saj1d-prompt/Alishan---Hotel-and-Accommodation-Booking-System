<?php

namespace App\Http\Requests;

use App\Enums\StayTerm;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'property_slug' =>
                is_string($this->property_slug)
                    ? strtolower(
                        trim(
                            $this->property_slug
                        )
                    )
                    : $this->property_slug,

            'room_type_slug' =>
                is_string(
                    $this->room_type_slug
                )
                    ? strtolower(
                        trim(
                            $this->room_type_slug
                        )
                    )
                    : $this->room_type_slug,

            'term' =>
                is_string($this->term)
                    ? strtolower(
                        trim($this->term)
                    )
                    : $this->term,

            'first_name' =>
                is_string($this->first_name)
                    ? trim(
                        $this->first_name
                    )
                    : $this->first_name,

            'last_name' =>
                is_string($this->last_name)
                    ? trim(
                        $this->last_name
                    )
                    : $this->last_name,

            'email' =>
                is_string($this->email)
                    ? strtolower(
                        trim($this->email)
                    )
                    : $this->email,

            'phone' =>
                is_string($this->phone)
                    ? trim($this->phone)
                    : $this->phone,

            'passport_number' =>
                is_string(
                    $this->passport_number
                )
                    ? trim(
                        $this->passport_number
                    )
                    : $this->passport_number,
        ]);
    }

    public function rules(): array
    {
        return [
            'property_slug' => [
                'required',
                'string',
                'max:180',

                Rule::exists(
                    'properties',
                    'slug'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'status',
                            true
                        )
                ),
            ],

            'room_type_slug' => [
                'required',
                'string',
                'max:180',

                Rule::exists(
                    'room_types',
                    'slug'
                )->where(
                    fn ($query) =>
                        $query->where(
                            'status',
                            true
                        )
                ),
            ],

            'term' => [
                'required',
                Rule::enum(
                    StayTerm::class
                ),
            ],

            'occupants' => [
                'required',
                'integer',
                'min:1',
                'max:4',
            ],

            'check_in_date' => [
                'nullable',
                'required_if:term,short_term',
                'date_format:Y-m-d',
                'after_or_equal:today',
            ],

            'check_out_date' => [
                'nullable',
                'required_if:term,short_term',
                'date_format:Y-m-d',
                'after:check_in_date',
            ],

            'first_name' => [
                'required',
                'string',
                'min:2',
                'max:100',
            ],

            'last_name' => [
                'required',
                'string',
                'min:2',
                'max:100',
            ],

            'email' => [
                'required',
                'email:rfc',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
                'regex:/^\+?[0-9\s().-]{7,30}$/',
            ],

            'passport_number' => [
                'required',
                'string',
                'min:4',
                'max:50',
                'regex:/^[\p{L}\p{N}\s-]+$/u',
            ],

            'passport_copy' => [
                'required',

                File::types([
                    'pdf',
                    'jpg',
                    'jpeg',
                    'png',
                ])->max('10mb'),
            ],

            'notes' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'privacy_accepted' => [
                'required',
                'accepted',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'property_slug.required' =>
                'Please select an accommodation location.',

            'room_type_slug.required' =>
                'Please select a room type.',

            'term.required' =>
                'Please select an accommodation term.',

            'occupants.max' =>
                'A booking request can contain no more than 4 occupants.',

            'check_in_date.required_if' =>
                'A check-in date is required for a short-term stay.',

            'check_out_date.required_if' =>
                'A check-out date is required for a short-term stay.',

            'phone.regex' =>
                'Please enter a valid phone number.',

            'passport_number.regex' =>
                'The passport number may contain letters, numbers, spaces and hyphens only.',

            'passport_copy.required' =>
                'Please attach a scanned passport copy.',

            'privacy_accepted.accepted' =>
                'You must confirm the privacy and accuracy declaration.',
        ];
    }
}