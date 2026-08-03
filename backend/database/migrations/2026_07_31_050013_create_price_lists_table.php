<?php

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

            $table->foreignId('property_contract_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('room_type_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->decimal('price', 10, 2);

            $table->string('currency', 3)
                ->default(Currency::EUR->value);

            /*
             * NULL = not specified.
             * TRUE = included.
             * FALSE = excluded.
             */
            $table->boolean('utilities_included')
                ->nullable();

            $table->date('effective_from');

            $table->date('effective_until')
                ->nullable();

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->index('status');

            $table->index([
                'effective_from',
                'effective_until',
            ]);

            $table->unique([
                'property_contract_id',
                'room_type_id',
                'effective_from',
            ], 'price_lists_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'price_lists'
        );
    }
};