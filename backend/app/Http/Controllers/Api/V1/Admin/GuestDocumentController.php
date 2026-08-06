<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectGuestDocumentRequest;
use App\Models\GuestDocument;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GuestDocumentController extends Controller
{
    public function download(
        GuestDocument $guestDocument
    ): StreamedResponse {
        $filesystem =
            $this->filesystem(
                $guestDocument->disk
            );

        abort_unless(
            $filesystem->exists(
                $guestDocument
                    ->file_path
            ),
            404,
            'The requested document was not found.'
        );

        return $filesystem->download(
            $guestDocument->file_path,
            $guestDocument
                ->original_name,
            [
                'Content-Type' =>
                    $guestDocument
                        ->mime_type,

                'X-Content-Type-Options' =>
                    'nosniff',

                'Cache-Control' =>
                    'private, no-store, no-cache, must-revalidate',

                'Pragma' =>
                    'no-cache',

                'Expires' =>
                    '0',
            ]
        );
    }

    public function verify(
        Request $request,
        GuestDocument $guestDocument
    ): JsonResponse {
        $document =
            DB::transaction(
                function () use (
                    $request,
                    $guestDocument
                ) {
                    $document =
                        GuestDocument::query()
                            ->whereKey(
                                $guestDocument->id
                            )
                            ->with(
                                'booking'
                            )
                            ->lockForUpdate()
                            ->firstOrFail();

                    if (
                        $document
                            ->booking
                            ->booking_status
                        !== BookingStatus
                            ::PENDING_REVIEW
                    ) {
                        throw ValidationException::withMessages([
                            'document' => [
                                'Passport proof can only be reviewed while the booking is pending review.',
                            ],
                        ]);
                    }

                    $document->update([
                        'verification_status' =>
                            'verified',

                        'verified_by_user_id' =>
                            $request
                                ->user()
                                ->id,

                        'verified_at' =>
                            now(),

                        'rejection_reason' =>
                            null,
                    ]);

                    return $document;
                }
            );

        return response()->json([
            'message' =>
                'Passport proof verified successfully.',

            'data' => [
                'uuid' =>
                    $document->uuid,

                'status' =>
                    $document
                        ->verification_status,

                'verified_at' =>
                    $document
                        ->verified_at
                        ?->toISOString(),
            ],
        ]);
    }

    public function reject(
        RejectGuestDocumentRequest $request,
        GuestDocument $guestDocument
    ): JsonResponse {
        $document =
            DB::transaction(
                function () use (
                    $request,
                    $guestDocument
                ) {
                    $document =
                        GuestDocument::query()
                            ->whereKey(
                                $guestDocument->id
                            )
                            ->with(
                                'booking'
                            )
                            ->lockForUpdate()
                            ->firstOrFail();

                    if (
                        $document
                            ->booking
                            ->booking_status
                        !== BookingStatus
                            ::PENDING_REVIEW
                    ) {
                        throw ValidationException::withMessages([
                            'document' => [
                                'Passport proof can only be reviewed while the booking is pending review.',
                            ],
                        ]);
                    }

                    $document->update([
                        'verification_status' =>
                            'rejected',

                        'verified_by_user_id' =>
                            $request
                                ->user()
                                ->id,

                        'verified_at' =>
                            now(),

                        'rejection_reason' =>
                            $request
                                ->validated(
                                    'reason'
                                ),
                    ]);

                    return $document;
                }
            );

        return response()->json([
            'message' =>
                'Passport proof rejected.',

            'data' => [
                'uuid' =>
                    $document->uuid,

                'status' =>
                    $document
                        ->verification_status,

                'rejection_reason' =>
                    $document
                        ->rejection_reason,
            ],
        ]);
    }

    private function filesystem(
        string $disk
    ): FilesystemAdapter {
        /** @var FilesystemAdapter $filesystem */
        $filesystem =
            Storage::disk($disk);

        return $filesystem;
    }
}