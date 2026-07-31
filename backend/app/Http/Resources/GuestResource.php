<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'guest_code' => $this->guest_code,

            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,

            'phone' => $this->phone,
            'email' => $this->email,

            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth,

            'nationality' => $this->nationality,

            'document_type' => $this->document_type,
            'document_number' => $this->document_number,

            'address' => $this->address,

            'status' => $this->status,

            'created_at' => $this->created_at,
        ];
    }
}