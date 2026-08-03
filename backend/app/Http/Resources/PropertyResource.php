<?php

namespace App\Http\Resources;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,

            'name' => $this->name,

            'slug' => $this->slug,

            'address' => $this->address,

            'postcode' => $this->postcode,

            'latitude' => $this->latitude,

            'longitude' => $this->longitude,

            'short_description' => $this->short_description,

            'description' => $this->description,

            'check_in_time' => $this->check_in_time,

            'check_out_time' => $this->check_out_time,

            'display_order' => $this->display_order,

            'status' => $this->status,

            'city' => $this->whenLoaded(
                'city',
                fn () => [
                    'name' => $this->city->name,
                    'slug' => $this->city->slug,
                ]
            ),

            'images' => $this->whenLoaded(
                'images',
                fn () => $this->images
                    ->where('status', true)
                    ->values()
                    ->map(
                        fn ($image) => [
                            'uuid' => $image->uuid,

                            'url' => $this->getImageUrl(
                                $image->disk,
                                $image->file_name
                            ),

                            'alt_text' => $image->alt_text,

                            'caption' => $image->caption,

                            'category' => $image->category?->value,

                            'is_cover' => $image->is_cover,
                        ]
                    )
            ),
        ];
    }

    private function getImageUrl(
        string $disk,
        string $fileName
    ): string {
        /** @var FilesystemAdapter $filesystem */
        $filesystem = Storage::disk($disk);

        return $filesystem->url($fileName);
    }
}