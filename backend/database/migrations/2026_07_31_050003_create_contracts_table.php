<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->string('code', 30)->unique();

            $table->string('name', 100);

            $table->string('billing_unit', 20);

            $table->unsignedSmallInteger('min_nights')
                ->nullable();

            $table->unsignedTinyInteger('max_months')
                ->nullable();

            $table->unsignedTinyInteger('fixed_start_month')
                ->nullable();

            $table->unsignedTinyInteger('fixed_start_day')
                ->nullable();

            $table->unsignedTinyInteger('fixed_end_month')
                ->nullable();

            $table->unsignedTinyInteger('fixed_end_day')
                ->nullable();

            $table->text('description')
                ->nullable();

            $table->unsignedInteger('display_order')
                ->default(0);

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->index('status');
            $table->index('display_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};