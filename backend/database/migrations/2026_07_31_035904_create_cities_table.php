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
    Schema::create('cities', function (Blueprint $table) {
        $table->id();

        $table->foreignId('country_id')
            ->constrained()
            ->cascadeOnUpdate()
            ->restrictOnDelete();

        $table->string('name', 100);

        $table->string('slug', 120)->unique();

        $table->boolean('status')->default(true);

        $table->timestamps();

        $table->unique(['country_id', 'name']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
