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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('city_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('name', 150);

            $table->string('slug', 180)->unique();

            $table->string('address');

            $table->string('postcode', 20)->nullable();

            $table->decimal('latitude', 10, 8)->nullable();

            $table->decimal('longitude', 11, 8)->nullable();

            $table->text('short_description')->nullable();

            $table->longText('description')->nullable();

            $table->time('check_in_time')->nullable();

            $table->time('check_out_time')->nullable();

            $table->unsignedInteger('display_order')->default(0);

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();

            // Indexes
            $table->index('status');
            $table->index('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};