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
        Schema::create("product_info", function(Blueprint $table){
            $table->id();
            $table->text("product_description") -> nullable();
            $table->decimal("product_price");
            $table->boolean("is_active") -> default(true);
            $table->string("product_link");
            $table->foreignId("product_id") ->constrained("products") -> cascadeOnDelete();
            $table->foreignId("product_type_id") ->nullable() ->
             constrained("product_types")->onDelete("set null");
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::dropIfExists('product_info');
    }
};
