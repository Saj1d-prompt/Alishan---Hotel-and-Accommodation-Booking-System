<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'payments',
            function (Blueprint $table) {
                $table
                    ->foreignId(
                        'payment_installment_id'
                    )
                    ->nullable()
                    ->after('booking_id')
                    ->constrained(
                        'payment_installments'
                    )
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();

                $table->index([
                    'payment_installment_id',
                    'payment_status',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'payments',
            function (Blueprint $table) {
                $table->dropIndex([
                    'payment_installment_id',
                    'payment_status',
                ]);

                $table
                    ->dropConstrainedForeignId(
                        'payment_installment_id'
                    );
            }
        );
    }
};