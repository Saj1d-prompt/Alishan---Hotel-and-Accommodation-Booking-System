<?php

namespace App\Services;

use App\Models\Guest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GuestService
{
    public function getAll()
    {
        return Guest::latest()->paginate(15);
    }

    public function create(array $data): Guest
    {
        return DB::transaction(function () use ($data) {

            $data['uuid'] = (string) Str::uuid();

            $lastGuest = Guest::latest('id')->first();

            $nextNumber = $lastGuest ? $lastGuest->id + 1 : 1;

            $data['guest_code'] = 'GST-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

            return Guest::create($data);
        });
    }

    public function update(Guest $guest, array $data): Guest
    {
        $guest->update($data);

        return $guest->fresh();
    }

    public function delete(Guest $guest): void
    {
        $guest->delete();
    }
}