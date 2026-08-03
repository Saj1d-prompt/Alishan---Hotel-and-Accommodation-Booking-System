<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BedResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,

            'bed_number' => $this->bed_number,

            'description' => $this->description,

            'display_order' => $this->display_order,

            'status' => $this->status,
        ];
    }
}