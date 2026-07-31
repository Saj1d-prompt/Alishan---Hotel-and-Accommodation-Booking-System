<?php

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
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
        Schema::create('bookings', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->string('booking_reference', 30)->unique();

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

            $table->decimal('total_amount', 10, 2);

            $table->string('booking_status')
                ->default(BookingStatus::PENDING->value);

            $table->string('payment_status')
                ->default(PaymentStatus::PENDING->value);

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->index('user_id');
            $table->index('property_id');
            $table->index('booking_status');
            $table->index('payment_status');
            $table->index('check_in_date');
            $table->index('check_out_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};