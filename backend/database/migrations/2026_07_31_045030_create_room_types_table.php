<?php

use App\Enums\BookingMode;
use App\Enums\Gender;
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
        Schema::create('rooms', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('room_type_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('room_number', 20);

            $table->string('floor', 20)->nullable();

            $table->unsignedTinyInteger('capacity');

            $table->string('gender')
                ->default(Gender::MIXED->value);

            $table->string('booking_mode')
                ->default(BookingMode::BOTH->value);

            $table->text('description')->nullable();

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->unique([
                'property_id',
                'room_number'
            ]);

            $table->index('status');
            $table->index('display_order');
            $table->index('gender');
            $table->index('booking_mode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};