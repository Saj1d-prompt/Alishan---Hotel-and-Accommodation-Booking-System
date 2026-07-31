<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGuestRequest;
use App\Http\Requests\UpdateGuestRequest;
use App\Http\Resources\GuestResource;
use App\Models\Guest;
use App\Services\GuestService;
use Illuminate\Http\JsonResponse;

class GuestController extends Controller
{
    public function __construct(
        private readonly GuestService $guestService
    ) {
    }

    public function index()
    {
        return GuestResource::collection(
            $this->guestService->getAll()
        );
    }

    public function store(StoreGuestRequest $request): GuestResource
    {
        $guest = $this->guestService->create(
            $request->validated()
        );

        return new GuestResource($guest);
    }

    public function show(Guest $guest): GuestResource
    {
        return new GuestResource($guest);
    }

    public function update(
        UpdateGuestRequest $request,
        Guest $guest
    ): GuestResource {
        $guest = $this->guestService->update(
            $guest,
            $request->validated()
        );

        return new GuestResource($guest);
    }

    public function destroy(Guest $guest): JsonResponse
    {
        $this->guestService->delete($guest);

        return response()->json([
            'message' => 'Guest deleted successfully.'
        ]);
    }
}