<?php

use App\Enums\Currency;
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
        Schema::create('payments', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('booking_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('payment_reference', 100)
                ->unique();

            $table->string('gateway', 50);

            $table->string('transaction_id')
                ->nullable();

            $table->decimal('amount', 10, 2);

            $table->string('currency', 3)
                ->default(Currency::EUR->value);

            $table->string('payment_status')
                ->default(PaymentStatus::PENDING->value);

            $table->timestamp('paid_at')
                ->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->index('booking_id');
            $table->index('payment_reference');
            $table->index('payment_status');
            $table->index('gateway');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};