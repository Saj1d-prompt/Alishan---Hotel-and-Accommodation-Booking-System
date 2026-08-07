<?php

namespace App\Http\Requests\PublicApi;

use Illuminate\Foundation\Http\FormRequest;

class StartPaymentCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => [
                'required',
                'string',
                'min:32',
                'max:255',
            ],
        ];
    }
}