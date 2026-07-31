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
        Schema::create('property_images', function (Blueprint $table) {

            $table->id();

            $table->uuid('uuid')->unique();

            $table->foreignId('property_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('file_name');

            $table->string('disk', 50)->default('public');

            $table->string('mime_type', 100)->nullable();

            $table->unsignedBigInteger('file_size')->nullable();

            $table->unsignedInteger('width')->nullable();

            $table->unsignedInteger('height')->nullable();

            $table->string('alt_text')->nullable();

            $table->text('caption')->nullable();

            $table->string('category', 50)->nullable();

            $table->boolean('is_cover')->default(false);

            $table->unsignedInteger('sort_order')->default(0);

            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->softDeletes();

            // Indexes
            $table->index('property_id');
            $table->index('category');
            $table->index('status');
            $table->index('sort_order');
            $table->index('is_cover');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_images');
    }
};