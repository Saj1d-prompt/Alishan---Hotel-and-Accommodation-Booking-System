<?php

use App\Enums\Currency;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('price_lists', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('contract_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('room_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('bed_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->decimal('price', 10, 2);

            $table->string('currency', 3)
                ->default(Currency::EUR->value);

            $table->date('effective_from');

            $table->date('effective_until')
                ->nullable();

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->index('contract_id');
            $table->index('room_id');
            $table->index('bed_id');
            $table->index('status');
            $table->index('effective_from');
            $table->index('effective_until');

            $table->unique([
                'contract_id',
                'room_id',
                'bed_id',
                'effective_from'
            ], 'price_lists_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_lists');
    }
};