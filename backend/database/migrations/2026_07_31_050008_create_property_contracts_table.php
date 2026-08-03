<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_contracts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('contract_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->json('allowed_floors')
                ->nullable();

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            $table->unique([
                'property_id',
                'contract_id',
            ]);

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_contracts');
    }
};