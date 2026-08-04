<?php

use App\Enums\ChargeBasis;
use App\Enums\Currency;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_lists', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            /*
             * Identifies:
             *
             * Property + Booking Term
             *
             * Examples:
             * Pylimo + Short Term
             * Pylimo + Long Term
             * Šeškinės + Long Term
             */
            $table->foreignId('property_contract_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            /*
             * Identifies the room capacity/category:
             *
             * 1 Bed Room
             * 2 Bed Room
             * 3 Bed Room
             * 4 Bed Room
             */
            $table->foreignId('room_type_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            /*
             * Amount charged per person for one billing unit.
             *
             * Examples:
             * €190 per person per month
             * €20 per person per night
             */
            $table->decimal('price', 10, 2);

            $table->string('currency', 3)
                ->default(Currency::EUR->value);

            $table->string('charge_basis', 30)
                ->default(ChargeBasis::PER_PERSON->value);

            /*
             * NULL:
             * Utility information is not separately specified.
             *
             * TRUE:
             * Utilities are included.
             *
             * FALSE:
             * Utilities are excluded.
             */
            $table->boolean('utilities_included')
                ->nullable();

            /*
             * Allows future price changes without overwriting
             * historical pricing records.
             */
            $table->date('effective_from');

            $table->date('effective_until')
                ->nullable();

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->index('status');

            $table->index('charge_basis');

            $table->index([
                'effective_from',
                'effective_until',
            ]);

            $table->index([
                'property_contract_id',
                'status',
            ]);

            $table->index([
                'room_type_id',
                'status',
            ]);

            /*
             * Prevent duplicate prices for the same property,
             * term, room type and effective date.
             */
            $table->unique([
                'property_contract_id',
                'room_type_id',
                'effective_from',
            ], 'price_lists_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_lists');
    }
};