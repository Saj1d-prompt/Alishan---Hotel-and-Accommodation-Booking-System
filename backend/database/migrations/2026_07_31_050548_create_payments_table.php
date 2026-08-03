<?php

use App\Enums\Currency;
use App\Enums\PaymentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('booking_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('payment_reference', 100)
                ->unique();

            /*
             * Stripe later, but keep the database provider-agnostic.
             */
            $table->string('gateway', 50);

            $table->string('gateway_session_id')
                ->nullable()
                ->unique();

            $table->string('gateway_payment_intent_id')
                ->nullable()
                ->unique();

            $table->string('transaction_id')
                ->nullable();

            $table->decimal('amount', 10, 2);

            $table->string('currency', 3)
                ->default(Currency::EUR->value);

            $table->string('payment_status', 30)
                ->default(PaymentStatus::PENDING->value);

            $table->string('failure_code')
                ->nullable();

            $table->text('failure_message')
                ->nullable();

            $table->timestamp('paid_at')
                ->nullable();

            $table->decimal('refunded_amount', 10, 2)
                ->default(0);

            $table->timestamp('refunded_at')
                ->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->index([
                'booking_id',
                'payment_status',
            ]);

            $table->index('gateway');

            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};