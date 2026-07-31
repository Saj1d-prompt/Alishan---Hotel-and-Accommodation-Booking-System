<?php

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
                ->cascadeOnDelete();

            $table->string('payment_reference',100)->unique();

            $table->string('gateway',50);

            $table->string('transaction_id')->nullable();

            $table->decimal('amount',10,2);

            $table->char('currency',3)->default('EUR');

            $table->string('payment_status',30)->default('pending');

            $table->timestamp('paid_at')->nullable();

            $table->timestamps();

            $table->index('payment_reference');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};