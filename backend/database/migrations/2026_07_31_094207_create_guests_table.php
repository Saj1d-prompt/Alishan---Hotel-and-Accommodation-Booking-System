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
        Schema::create('guests', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->string('guest_code', 30)->unique();

            $table->string('first_name');

            $table->string('last_name')->nullable();

            $table->string('phone', 30);

            $table->string('email')->nullable();

            $table->date('date_of_birth')->nullable();

            $table->string('gender', 20)->nullable();

            $table->string('nationality')->nullable();

            $table->string('document_type', 30);

            $table->string('document_number')->unique();

            $table->date('document_expiry_date')->nullable();

            $table->text('address')->nullable();

            $table->string('emergency_contact_name')->nullable();

            $table->string('emergency_contact_phone', 30)->nullable();

            $table->text('notes')->nullable();

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->index('guest_code');
            $table->index('phone');
            $table->index('status');
            $table->index('document_type');
            $table->index('nationality');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};