<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\StayTerm;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\GuestDocument;
use App\Models\PriceList;
use App\Models\Property;
use App\Models\PropertyContract;
use App\Models\RoomType;
use App\Support\PassportNumber;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class BookingRequestService
{
    public function __construct(
        private readonly
        RoomAvailabilityService
        $roomAvailabilityService
    ) {}

    /**
     * @return array{
     *     booking: Booking,
     *     access_token: string
     * }
     */
    public function create(
        array $data,
        UploadedFile $passportCopy
    ): array {
        $storedPath = null;

        try {
            return DB::transaction(
                function () use (
                    $data,
                    $passportCopy,
                    &$storedPath
                ): array {
                    $property =
                        Property::query()
                        ->where(
                            'slug',
                            $data['property_slug']
                        )
                        ->where(
                            'status',
                            true
                        )
                        ->firstOrFail();

                    $roomType =
                        RoomType::query()
                        ->where(
                            'slug',
                            $data['room_type_slug']
                        )
                        ->where(
                            'status',
                            true
                        )
                        ->firstOrFail();

                    $occupants =
                        (int)
                        $data['occupants'];

                    if (
                        $occupants >
                        $roomType
                        ->default_capacity
                    ) {
                        throw ValidationException::withMessages([
                            'occupants' => [
                                "The selected {$roomType->name} can accommodate a maximum of {$roomType->default_capacity} occupants.",
                            ],
                        ]);
                    }

                    $stayTerm =
                        StayTerm::from(
                            $data['term']
                        );

                    $propertyContract =
                        $this
                        ->resolvePropertyContract(
                            $property,
                            $stayTerm
                        );

                    $priceList =
                        $this
                        ->resolvePriceList(
                            $propertyContract,
                            $roomType
                        );

                    /*
                     * Resolve exactly the same period
                     * used by the public catalogue.
                     */
                    $period =
                        $this
                        ->roomAvailabilityService
                        ->resolveStayPeriod(
                            $propertyContract,
                            $stayTerm,
                            $data['check_in_date']
                                ?? null,
                            $data['check_out_date']
                                ?? null
                        );

                    $checkIn =
                        $period['check_in'];

                    $checkOut =
                        $period['check_out'];

                    $durationUnits =
                        $period['duration_units'];

                    /*
                     * SECURITY / BUSINESS RULE:
                     *
                     * Do not create pending_review
                     * applications for room types
                     * with zero current inventory.
                     */
                    $this
                        ->roomAvailabilityService
                        ->assertRoomTypeAvailable(
                            $propertyContract,
                            $roomType,
                            $occupants,
                            $checkIn,
                            $checkOut
                        );

                    $passportNumber =
                        PassportNumber::normalize(
                            $data['passport_number']
                        );

                    $passportHash =
                        PassportNumber::hash(
                            $passportNumber
                        );

                    $guest =
                        Guest::query()
                        ->where(
                            'document_number_hash',
                            $passportHash
                        )
                        ->first();

                    $guestData = [
                        'first_name' =>
                        $data['first_name'],

                        'last_name' =>
                        $data['last_name'],

                        'phone' =>
                        $data['phone'],

                        'email' =>
                        $data['email'],

                        'document_type' =>
                        'passport',

                        'document_number' =>
                        $passportNumber,

                        'document_number_hash' =>
                        $passportHash,

                        'status' =>
                        true,
                    ];

                    if ($guest) {
                        $guest->update(
                            $guestData
                        );
                    } else {
                        $guest =
                            Guest::create([
                                ...$guestData,

                                'uuid' =>
                                (string)
                                Str::uuid(),

                                'guest_code' =>
                                'GST-'
                                    . (string)
                                    Str::ulid(),
                            ]);
                    }

                    $rawAccessToken =
                        bin2hex(
                            random_bytes(
                                32
                            )
                        );

                    $unitPrice =
                        (float)
                        $priceList
                            ->price;

                    /*
                     * Rates are PER PERSON.
                     */
                    $estimatedTotal =
                        round(
                            $unitPrice
                                * $occupants
                                * $durationUnits,
                            2
                        );

                    $booking =
                        Booking::create([
                            'uuid' =>
                            (string)
                            Str::uuid(),

                            'booking_reference' =>
                            $this
                                ->generateBookingReference(),

                            'guest_id' =>
                            $guest->id,

                            'property_id' =>
                            $property->id,

                            'guest_count' =>
                            $occupants,

                            'check_in_date' =>
                            $checkIn
                                ->toDateString(),

                            'check_out_date' =>
                            $checkOut
                                ->toDateString(),

                            'estimated_total_amount' =>
                            $estimatedTotal,

                            /*
                             * Admin decides the
                             * payable amount later.
                             */
                            'total_amount' =>
                            null,

                            'currency' =>
                            $priceList
                                ->currency
                                ->value,

                            'booking_status' =>
                            BookingStatus
                            ::PENDING_REVIEW
                                ->value,

                            'source' =>
                            'website',

                            'public_access_token_hash' =>
                            hash(
                                'sha256',
                                $rawAccessToken
                            ),

                            'public_access_token' =>
                            $rawAccessToken,

                            'submitted_at' =>
                            now(),

                            'privacy_accepted_at' =>
                            now(),

                            'notes' =>
                            $data['notes']
                                ?? null,
                        ]);

                    $booking
                        ->items()
                        ->create([
                            'room_type_id' =>
                            $roomType->id,

                            /*
                             * No physical room is
                             * reserved at this stage.
                             */
                            'room_id' =>
                            null,

                            'bed_id' =>
                            null,

                            'contract_id' =>
                            $propertyContract
                                ->contract_id,

                            'price_list_id' =>
                            $priceList
                                ->id,

                            'unit_price' =>
                            $priceList
                                ->price,

                            'billing_unit' =>
                            $propertyContract
                                ->contract
                                ->billing_unit,

                            'charge_basis' =>
                            $priceList
                                ->charge_basis
                                ->value,

                            'occupant_count' =>
                            $occupants,

                            'duration_units' =>
                            $durationUnits,

                            'subtotal' =>
                            $estimatedTotal,
                        ]);

                    $extension =
                        strtolower(
                            $passportCopy
                                ->extension()
                                ?: 'bin'
                        );

                    $fileName =
                        'passport-'
                        . Str::uuid()
                        . '.'
                        . $extension;

                    $directory =
                        'guest-documents/'
                        . $booking->uuid;

                    $storedPath =
                        Storage::disk(
                            'local'
                        )->putFileAs(
                            $directory,
                            $passportCopy,
                            $fileName
                        );

                    if (
                        ! is_string(
                            $storedPath
                        )
                        || $storedPath === ''
                    ) {
                        throw new RuntimeException(
                            'The passport copy could not be stored.'
                        );
                    }

                    GuestDocument::create([
                        'uuid' =>
                        (string)
                        Str::uuid(),

                        'guest_id' =>
                        $guest->id,

                        'booking_id' =>
                        $booking->id,

                        'document_type' =>
                        'passport_copy',

                        'disk' =>
                        'local',

                        'file_path' =>
                        $storedPath,

                        'original_name' =>
                        $passportCopy
                            ->getClientOriginalName(),

                        'mime_type' =>
                        $passportCopy
                            ->getMimeType()
                            ?: 'application/octet-stream',

                        'file_size' =>
                        $passportCopy
                            ->getSize(),

                        'sha256_hash' =>
                        hash_file(
                            'sha256',
                            $passportCopy
                                ->getRealPath()
                        ),

                        'verification_status' =>
                        'pending',
                    ]);

                    $booking->load([
                        'guest',
                        'property.city',
                        'items.roomType',
                        'items.contract',
                        'items.priceList',
                        'documents',
                    ]);

                    return [
                        'booking' =>
                        $booking,

                        'access_token' =>
                        $rawAccessToken,
                    ];
                }
            );
        } catch (
            Throwable $exception
        ) {
            if (
                is_string(
                    $storedPath
                )
                && $storedPath !== ''
            ) {
                Storage::disk(
                    'local'
                )->delete(
                    $storedPath
                );
            }

            throw $exception;
        }
    }

    private function resolvePropertyContract(
        Property $property,
        StayTerm $stayTerm
    ): PropertyContract {
        $propertyContract =
            PropertyContract::query()
            ->where(
                'property_id',
                $property->id
            )
            ->where(
                'status',
                true
            )
            ->whereHas(
                'contract',
                function (
                    $query
                ) use ($stayTerm) {
                    $query
                        ->where(
                            'code',
                            $stayTerm
                                ->contractCode()
                        )
                        ->where(
                            'status',
                            true
                        );
                }
            )
            ->with('contract')
            ->first();

        if (! $propertyContract) {
            throw ValidationException::withMessages([
                'term' => [
                    "{$property->name} does not support {$stayTerm->label()} bookings.",
                ],
            ]);
        }

        return $propertyContract;
    }

    private function resolvePriceList(
        PropertyContract $propertyContract,
        RoomType $roomType
    ): PriceList {
        $today =
            now()->toDateString();

        $priceList =
            PriceList::query()
            ->where(
                'property_contract_id',
                $propertyContract
                    ->id
            )
            ->where(
                'room_type_id',
                $roomType->id
            )
            ->where(
                'status',
                true
            )
            ->whereDate(
                'effective_from',
                '<=',
                $today
            )
            ->where(
                function (
                    $query
                ) use ($today) {
                    $query
                        ->whereNull(
                            'effective_until'
                        )
                        ->orWhereDate(
                            'effective_until',
                            '>=',
                            $today
                        );
                }
            )
            ->latest(
                'effective_from'
            )
            ->first();

        if (! $priceList) {
            throw ValidationException::withMessages([
                'room_type_slug' => [
                    'The selected room type is not offered for this location and accommodation term.',
                ],
            ]);
        }

        return $priceList;
    }

    private function generateBookingReference(): string
    {
        do {
            $reference =
                sprintf(
                    'ALI-%s-%s',
                    now()->format(
                        'Y'
                    ),
                    Str::upper(
                        Str::random(
                            8
                        )
                    )
                );
        } while (
            Booking::query()
            ->where(
                'booking_reference',
                $reference
            )
            ->exists()
        );

        return $reference;
    }
}
