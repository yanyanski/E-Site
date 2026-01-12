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
        Schema::create("product_images", function(Blueprint $table){
            $table->id();
            $table->string("image_path");
            $table->string("image_alt");
            $table->foreignId("product_id")
                    ->nullable()
                    ->constrained("products")
                    ->nullOnDelete();
            $table->string("file_extension");
            $table->string("mime_type");
            $table->string("file_size");
            $table->string("file_name");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("product_images");
    }
};
