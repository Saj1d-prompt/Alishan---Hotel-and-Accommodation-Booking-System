<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\GuestDocument;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GuestDocumentController extends Controller
{
    public function download(
        GuestDocument $guestDocument
    ): StreamedResponse {
        $filesystem = $this->filesystem(
            $guestDocument->disk
        );

        abort_unless(
            $filesystem->exists(
                $guestDocument->file_path
            ),
            404,
            'The requested passport document was not found.'
        );

        return $filesystem->download(
            $guestDocument->file_path,
            $guestDocument->original_name,
            [
                'Content-Type' =>
                    $guestDocument->mime_type,

                'Content-Disposition' =>
                    'attachment; filename="' .
                    addslashes(
                        $guestDocument->original_name
                    ) .
                    '"',

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

    private function filesystem(
        string $disk
    ): FilesystemAdapter {
        /** @var FilesystemAdapter $filesystem */
        $filesystem = Storage::disk($disk);

        return $filesystem;
    }
}