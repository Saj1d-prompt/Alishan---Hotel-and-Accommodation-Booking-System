<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'payment_gateway_events',
            function (Blueprint $table) {
                $table->id();

                $table->string(
                    'gateway',
                    50
                );

                $table->string(
                    'event_id',
                    255
                );

                $table
                    ->string(
                        'event_type',
                        150
                    )
                    ->nullable();

                $table
                    ->string(
                        'status',
                        30
                    )
                    ->default('received');

                $table
                    ->string(
                        'payload_hash',
                        64
                    )
                    ->nullable();

                $table
                    ->timestamp(
                        'processed_at'
                    )
                    ->nullable();

                $table
                    ->text(
                        'error_message'
                    )
                    ->nullable();

                $table->timestamps();

                $table->unique([
                    'gateway',
                    'event_id',
                ]);

                $table->index([
                    'gateway',
                    'status',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'payment_gateway_events'
        );
    }
};