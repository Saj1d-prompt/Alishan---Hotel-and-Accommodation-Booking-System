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
        $term = $this->query('term');

        if (is_string($term)) {
            $this->merge([
                'term' => strtolower(trim($term)),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'term' => [
                'required',
                Rule::enum(StayTerm::class),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'term.required' =>
                'Please select a short-term or long-term booking option.',

            'term.enum' =>
                'The selected booking term is invalid.',
        ];
    }

    public function stayTerm(): StayTerm
    {
        return StayTerm::from(
            $this->validated('term')
        );
    }
}