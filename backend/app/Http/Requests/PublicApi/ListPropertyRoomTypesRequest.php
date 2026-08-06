<?php

namespace App\Http\Requests\PublicApi;

use App\Enums\StayTerm;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListPropertyRoomTypesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $term =
            $this->query('term');

        if (
            is_string($term)
        ) {
            $this->merge([
                'term' =>
                    strtolower(
                        trim($term)
                    ),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'term' => [
                'required',
                Rule::enum(
                    StayTerm::class
                ),
            ],

            'occupants' => [
                'nullable',
                'integer',
                'min:1',
                'max:4',
            ],

            /*
             * Short-term availability cannot be
             * calculated without dates.
             */
            'start_date' => [
                'nullable',
                'required_if:term,short_term',
                'date_format:Y-m-d',
                'after_or_equal:today',
            ],

            'end_date' => [
                'nullable',
                'required_if:term,short_term',
                'date_format:Y-m-d',
                'after:start_date',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'term.required' =>
                'Please select a short-term or long-term accommodation option.',

            'term.enum' =>
                'The selected accommodation term is invalid.',

            'occupants.min' =>
                'At least one occupant is required.',

            'occupants.max' =>
                'A maximum of four occupants can be searched at once.',

            'start_date.required_if' =>
                'Please select an arrival date before checking short-term availability.',

            'end_date.required_if' =>
                'Please select a departure date before checking short-term availability.',

            'end_date.after' =>
                'The departure date must be after the arrival date.',
        ];
    }

    public function stayTerm(): StayTerm
    {
        return StayTerm::from(
            $this->validated(
                'term'
            )
        );
    }

    public function occupants(): int
    {
        return (int) (
            $this->validated(
                'occupants'
            )
            ?? 1
        );
    }

    public function checkInDate(): ?string
    {
        return $this->validated(
            'start_date'
        );
    }

    public function checkOutDate(): ?string
    {
        return $this->validated(
            'end_date'
        );
    }
}