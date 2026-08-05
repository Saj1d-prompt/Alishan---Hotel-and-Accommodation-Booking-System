<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();

            $table->uuid('uuid')->unique();

            $table->string('guest_code', 30)
                ->unique();

            $table->string('first_name', 100);

            $table->string('last_name', 100)
                ->nullable();

            $table->string('phone', 30);

            $table->string('email');

            $table->date('date_of_birth')
                ->nullable();

            $table->string('gender', 20)
                ->nullable();

            $table->string('nationality', 100)
                ->nullable();

            $table->string('document_type', 30)
                ->default('passport');

            /*
             * This value will be encrypted automatically
             * by the Guest model.
             */
            $table->text('document_number');

            /*
             * Searchable HMAC for duplicate detection.
             * Never return this through an API.
             */
            $table->char(
                'document_number_hash',
                64
            )->unique();

            $table->date('document_expiry_date')
                ->nullable();

            $table->text('address')
                ->nullable();

            $table->string(
                'emergency_contact_name',
                100
            )->nullable();

            $table->string(
                'emergency_contact_phone',
                30
            )->nullable();

            $table->text('notes')
                ->nullable();

            $table->boolean('status')
                ->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->index('phone');
            $table->index('email');
            $table->index('status');
            $table->index('document_type');
            $table->index('nationality');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};