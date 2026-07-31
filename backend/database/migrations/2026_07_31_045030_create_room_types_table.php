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
        Schema::create('room_types', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->string('name', 100);

            $table->string('slug', 120)->unique();

            $table->text('description')->nullable();

            $table->unsignedTinyInteger('default_capacity');

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
        Schema::dropIfExists('room_types');
    }
};