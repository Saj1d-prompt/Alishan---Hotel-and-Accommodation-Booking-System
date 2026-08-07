<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * Prevent duplicate payment-received emails
         * when Stripe retries the same event.
         */
        Schema::table(
            'payments',
            function (
                Blueprint $table
            ) {
                $table
                    ->timestamp(
                        'receipt_notification_queued_at'
                    )
                    ->nullable()
                    ->after(
                        'refunded_at'
                    )
                    ->index();
            }
        );

        /*
         * Prevent the daily/hourly scheduler from
         * repeatedly sending the same second-payment reminder.
         */
        Schema::table(
            'payment_installments',
            function (
                Blueprint $table
            ) {
                $table
                    ->timestamp(
                        'reminder_notification_queued_at'
                    )
                    ->nullable()
                    ->after(
                        'paid_at'
                    )
                    ->index();
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'payment_installments',
            function (
                Blueprint $table
            ) {
                $table->dropColumn(
                    'reminder_notification_queued_at'
                );
            }
        );

        Schema::table(
            'payments',
            function (
                Blueprint $table
            ) {
                $table->dropColumn(
                    'receipt_notification_queued_at'
                );
            }
        );
    }
};