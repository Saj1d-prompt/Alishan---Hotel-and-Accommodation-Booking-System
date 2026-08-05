<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'guest_documents',
            function (Blueprint $table) {
                $table->id();

                $table->uuid('uuid')
                    ->unique();

                $table->foreignId('guest_id')
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();

                $table->foreignId('booking_id')
                    ->constrained()
                    ->cascadeOnUpdate()
                    ->restrictOnDelete();

                $table->string(
                    'document_type',
                    30
                )->default('passport_copy');

                $table->string('disk', 50)
                    ->default('local');

                $table->string('file_path');

                $table->string('original_name');

                $table->string(
                    'mime_type',
                    100
                );

                $table->unsignedBigInteger(
                    'file_size'
                );

                $table->char(
                    'sha256_hash',
                    64
                );

                $table->string(
                    'verification_status',
                    30
                )->default('pending');

                $table->foreignId(
                    'verified_by_user_id'
                )
                    ->nullable()
                    ->constrained('users')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();

                $table->timestamp(
                    'verified_at'
                )->nullable();

                $table->text(
                    'rejection_reason'
                )->nullable();

                $table->timestamps();

                $table->softDeletes();

                $table->index([
                    'booking_id',
                    'verification_status',
                ]);

                $table->index([
                    'guest_id',
                    'document_type',
                ]);

                $table->index('sha256_hash');
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'guest_documents'
        );
    }
};