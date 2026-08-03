<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('booking_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            /*
             * Customer chooses room category/type first.
             */
            $table->foreignId('room_type_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            /*
             * Physical room is assigned after Admin approval.
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

            /*
             * Pricing/contract can be determined during approval.
             */
            $table->foreignId('contract_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('price_list_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->decimal('unit_price', 10, 2)
                ->nullable();

            $table->unsignedInteger('quantity')
                ->default(1);

            $table->decimal('subtotal', 10, 2)
                ->nullable();

            $table->timestamps();

            $table->index('booking_id');
            $table->index('room_type_id');
            $table->index('room_id');
            $table->index('bed_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_items');
    }
};