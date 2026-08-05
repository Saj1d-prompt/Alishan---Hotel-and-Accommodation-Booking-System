<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'booking_items',
            function (Blueprint $table) {
                $table->id();

                $table->foreignId('booking_id')
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();

                $table->foreignId(
                    'room_type_id'
                )
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();

                /*
                 * Assigned after Admin approval.
                 */
                $table->foreignId('room_id')
                    ->nullable()
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();

                $table->foreignId('bed_id')
                    ->nullable()
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->nullOnDelete();

                $table->foreignId(
                    'contract_id'
                )
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();

                $table->foreignId(
                    'price_list_id'
                )
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();

                /*
                 * Authoritative pricing snapshot.
                 */
                $table->decimal(
                    'unit_price',
                    10,
                    2
                );

                $table->string(
                    'billing_unit',
                    20
                );

                $table->string(
                    'charge_basis',
                    30
                );

                $table->unsignedTinyInteger(
                    'occupant_count'
                );

                /*
                 * Nights for short-term.
                 * Months for long-term.
                 */
                $table->unsignedSmallInteger(
                    'duration_units'
                );

                $table->decimal(
                    'subtotal',
                    10,
                    2
                );

                $table->timestamps();

                $table->index('booking_id');
                $table->index('room_type_id');
                $table->index('room_id');
                $table->index('bed_id');
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'booking_items'
        );
    }
};