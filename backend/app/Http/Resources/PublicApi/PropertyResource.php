<?php

namespace App\Http\Resources\PublicApi;

use App\Enums\StayTerm;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $coverImage = null;

        if ($this->relationLoaded('images')) {
            $coverImage =
                $this->images->firstWhere(
                    'is_cover',
                    true
                )
                ?? $this->images->first();
        }

        return [
            'uuid' => $this->uuid,

            'name' => $this->name,

            'slug' => $this->slug,

            'address' => $this->address,

            'postcode' => $this->postcode,

            'city' => $this->whenLoaded(
                'city',
                fn () => [
                    'name' =>
                        $this->city->name,

                    'slug' =>
                        $this->city->slug,
                ]
            ),

            'coordinates' => [
                'latitude' =>
                    $this->latitude,

                'longitude' =>
                    $this->longitude,
            ],

            'short_description' =>
                $this->short_description,

            'description' =>
                $this->description,

            /*
             * Total inventory only.
             * This is not date-based availability.
             */
            'total_rooms' =>
                $this->whenCounted('rooms'),

            'cover_image' => $coverImage
                ? [
                    'url' =>
                        $this->imageUrl(
                            $coverImage->disk,
                            $coverImage->file_name
                        ),

                    'alt_text' =>
                        $coverImage->alt_text
                        ?: $this->name,
                ]
                : null,

            'terms' => $this->whenLoaded(
                'propertyContracts',
                function () {
                    return $this
                        ->propertyContracts
                        ->filter(
                            fn ($propertyContract) =>
                                $propertyContract
                                    ->contract !== null
                        )
                        ->map(
                            function (
                                $propertyContract
                            ) {
                                $term =
                                    StayTerm::fromContractCode(
                                        $propertyContract
                                            ->contract
                                            ->code
                                    );

                                $prices =
                                    $propertyContract
                                        ->priceLists;

                                $firstPrice =
                                    $prices->first();

                                $startingPrice =
                                    $prices->isNotEmpty()
                                        ? $prices->min(
                                            fn ($price) =>
                                                (float) $price
                                                    ->price
                                        )
                                        : null;

                                return [
                                    'code' =>
                                        $term->value,

                                    'name' =>
                                        $term->label(),

                                    'billing_unit' =>
                                        $propertyContract
                                            ->contract
                                            ->billing_unit,

                                    'starting_price' =>
                                        $startingPrice,

                                    'currency' =>
                                        $firstPrice
                                            ?->currency
                                            ?->value,

                                    'charge_basis' =>
                                        $firstPrice
                                            ?->charge_basis
                                            ?->value,

                                    'charge_basis_label' =>
                                        $firstPrice
                                            ?->charge_basis
                                            ?->label(),

                                    'allowed_floors' =>
                                        $propertyContract
                                            ->allowed_floors,
                                ];
                            }
                        )
                        ->values();
                }
            ),
        ];
    }

    private function imageUrl(
        string $disk,
        string $fileName
    ): string {
        /** @var FilesystemAdapter $filesystem */
        $filesystem = Storage::disk($disk);

        return $filesystem->url($fileName);
    }
}