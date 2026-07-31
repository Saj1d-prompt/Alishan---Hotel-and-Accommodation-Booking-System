<?php

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
        Schema::create('beds', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('room_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('bed_number', 20);

            $table->text('description')->nullable();

            $table->unsignedInteger('display_order')->default(0);

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->unique([
                'room_id',
                'bed_number'
            ]);

            $table->index('status');
            $table->index('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beds');
    }
};