<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'payment_installments',
            function (Blueprint $table) {
                $table->id();

                $table->uuid('uuid')->unique();

                $table
                    ->foreignId('booking_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table
                    ->unsignedSmallInteger(
                        'installment_number'
                    );

                $table->string(
                    'label',
                    100
                );

                $table->decimal(
                    'amount',
                    12,
                    2
                );

                $table
                    ->decimal(
                        'paid_amount',
                        12,
                        2
                    )
                    ->default(0);

                $table->dateTime(
                    'due_at'
                );

                $table
                    ->string(
                        'status',
                        30
                    )
                    ->default('pending');

                $table
                    ->dateTime(
                        'paid_at'
                    )
                    ->nullable();

                $table->timestamps();

                $table->unique([
                    'booking_id',
                    'installment_number',
                ]);

                $table->index([
                    'status',
                    'due_at',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'payment_installments'
        );
    }
};