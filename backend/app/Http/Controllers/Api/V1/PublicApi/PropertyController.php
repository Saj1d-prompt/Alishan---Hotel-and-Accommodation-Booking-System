<?php

namespace App\Http\Controllers\Api\V1\PublicApi;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicApi\ListPropertyRoomTypesRequest;
use App\Http\Resources\PublicApi\PropertyOfferResource;
use App\Http\Resources\PublicApi\PropertyResource;
use App\Models\Property;
use App\Services\PropertyCatalogService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PropertyController extends Controller
{
    public function __construct(
        private readonly
        PropertyCatalogService
        $catalogService
    ) {
    }

    public function index(): AnonymousResourceCollection
    {
        $properties =
            $this
                ->catalogService
                ->getLocations();

        return PropertyResource::collection(
            $properties
        );
    }

    public function show(
        Property $property
    ): PropertyResource {
        abort_unless(
            $property->status,
            404
        );

        $property =
            $this
                ->catalogService
                ->getLocation(
                    $property
                );

        return new PropertyResource(
            $property
        );
    }

    public function roomTypes(
        ListPropertyRoomTypesRequest $request,
        Property $property
    ): PropertyOfferResource {
        abort_unless(
            $property->status,
            404
        );

        $propertyContract =
            $this
                ->catalogService
                ->getRoomTypeOffers(
                    $property,
                    $request
                        ->stayTerm(),
                    $request
                        ->occupants(),
                    $request
                        ->checkInDate(),
                    $request
                        ->checkOutDate()
                );

        return new PropertyOfferResource(
            $propertyContract
        );
    }
}