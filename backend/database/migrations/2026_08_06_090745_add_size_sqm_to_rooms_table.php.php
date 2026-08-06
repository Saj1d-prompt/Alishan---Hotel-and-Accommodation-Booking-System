<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'rooms',
            function (Blueprint $table) {
                $table
                    ->decimal(
                        'size_sqm',
                        6,
                        2
                    )
                    ->nullable()
                    ->after('capacity');
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'rooms',
            function (Blueprint $table) {
                $table->dropColumn(
                    'size_sqm'
                );
            }
        );
    }
};