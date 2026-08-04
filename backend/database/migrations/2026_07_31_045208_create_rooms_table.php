<?php

use App\Enums\BookingMode;
use App\Enums\Gender;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            /*
             * Nullable temporarily because the client has not yet
             * provided the real room-type allocation.
             */
            $table->foreignId('room_type_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            /*
             * Temporary development codes:
             *
             * SES-001 to SES-013
             * LAT-001 to LAT-009
             * PYL-001 to PYL-024
             *
             * These will later be replaced by the real room numbers.
             */
            $table->string('room_number', 50);

            /*
             * Nullable until the client supplies the real floor
             * information for each physical room.
             */
            $table->unsignedTinyInteger('floor')
                ->nullable();

            /*
             * Nullable until every temporary room is assigned its
             * actual room type and capacity.
             */
            $table->unsignedTinyInteger('capacity')
                ->nullable();

            $table->enum('gender', [
                Gender::MALE->value,
                Gender::FEMALE->value,
                Gender::MIXED->value,
            ])->default(Gender::MIXED->value);

            $table->enum('booking_mode', [
                BookingMode::ROOM->value,
                BookingMode::BED->value,
                BookingMode::BOTH->value,
            ])->default(BookingMode::BOTH->value);

            $table->text('description')
                ->nullable();

            $table->unsignedInteger('display_order')
                ->default(0);

            /*
             * Temporary room records must remain inactive until their
             * real number, floor, room type and capacity are confirmed.
             */
            $table->boolean('status')
                ->default(false);

            $table->timestamps();

            $table->softDeletes();

            /*
             * The same room number cannot be repeated inside one
             * property, but different properties can use the same code.
             */
            $table->unique([
                'property_id',
                'room_number',
            ]);

            /*
             * Indexes needed by inventory and availability queries.
             */
            $table->index([
                'property_id',
                'status',
            ]);

            $table->index([
                'property_id',
                'room_type_id',
                'status',
            ]);

            $table->index([
                'property_id',
                'floor',
                'status',
            ]);

            $table->index('display_order');

            $table->index('gender');

            $table->index('booking_mode');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};