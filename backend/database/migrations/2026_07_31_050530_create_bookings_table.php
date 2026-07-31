<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->string('booking_reference',30)->unique();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->date('check_in_date');

            $table->date('check_out_date');

            $table->decimal('total_amount',10,2);

            $table->string('booking_status',30)->default('pending');

            $table->string('payment_status',30)->default('pending');

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->index('booking_reference');
            $table->index('booking_status');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};