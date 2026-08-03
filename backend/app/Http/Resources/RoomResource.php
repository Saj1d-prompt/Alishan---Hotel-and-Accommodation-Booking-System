<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,

            'room_number' => $this->room_number,

            'floor' => $this->floor,

            'capacity' => $this->capacity,

            'gender' => $this->gender?->value,

            'booking_mode' => $this->booking_mode?->value,

            'description' => $this->description,

            'display_order' => $this->display_order,

            'status' => $this->status,

            'room_type' => $this->whenLoaded(
                'roomType',
                fn () => [
                    'uuid' => $this->roomType->uuid,
                    'name' => $this->roomType->name,
                    'slug' => $this->roomType->slug,
                    'default_capacity' =>
                        $this->roomType->default_capacity,
                ]
            ),

            'beds' => BedResource::collection(
                $this->whenLoaded('beds')
            ),
        ];
    }
}