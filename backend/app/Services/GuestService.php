<?php

namespace App\Services;

use App\Models\Guest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GuestService
{
    public function getAll(): LengthAwarePaginator
    {
        return Guest::query()
            ->latest('id')
            ->paginate(15);
    }

    public function create(array $data): Guest
    {
        return DB::transaction(function () use ($data): Guest {
            $data['uuid'] = (string) Str::uuid();

            /*
             * ULID is 26 characters.
             * "GST-" + 26 characters = exactly 30 characters.
             */
            $data['guest_code'] = 'GST-' . (string) Str::ulid();

            return Guest::create($data);
        });
    }

    public function update(
        Guest $guest,
        array $data
    ): Guest {
        $guest->update($data);

        return $guest->refresh();
    }

    public function delete(Guest $guest): void
    {
        $guest->delete();
    }
}