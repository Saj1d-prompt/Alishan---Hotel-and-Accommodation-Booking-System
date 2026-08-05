<?php

use App\Enums\BookingStatus;
use App\Enums\Currency;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (
            Blueprint $table
        ) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->string(
                'booking_reference',
                30
            )->unique();

            $table->foreignId('guest_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId(
                'created_by_user_id'
            )
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->foreignId(
                'reviewed_by_user_id'
            )
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->unsignedTinyInteger(
                'guest_count'
            )->default(1);

            $table->date('check_in_date');

            $table->date('check_out_date');

            /*
             * Full estimated stay or contract value.
             * This is not necessarily what Stripe
             * will collect.
             */
            $table->decimal(
                'estimated_total_amount',
                10,
                2
            )->nullable();

            /*
             * Actual amount approved by Admin for
             * payment. This stays NULL during review.
             */
            $table->decimal(
                'total_amount',
                10,
                2
            )->nullable();

            $table->string('currency', 3)
                ->default(
                    Currency::EUR->value
                );

            $table->string(
                'booking_status',
                40
            )->default(
                BookingStatus::PENDING_REVIEW
                    ->value
            );

            $table->string('source', 30)
                ->default('website');

            /*
             * Only the SHA-256 hash is stored.
             * The raw token is returned once.
             */
            $table->char(
                'public_access_token_hash',
                64
            )->unique();

            $table->timestamp('submitted_at')
                ->nullable();

            $table->timestamp(
                'privacy_accepted_at'
            )->nullable();

            $table->timestamp('reviewed_at')
                ->nullable();

            $table->text('rejection_reason')
                ->nullable();

            $table->timestamp('payment_due_at')
                ->nullable();

            $table->timestamp('confirmed_at')
                ->nullable();

            $table->timestamp('cancelled_at')
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->index('booking_status');

            $table->index([
                'property_id',
                'check_in_date',
                'check_out_date',
            ]);

            $table->index([
                'property_id',
                'booking_status',
            ]);

            $table->index('guest_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};