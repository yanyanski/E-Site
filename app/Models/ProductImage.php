<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{   
    protected $table = "product_images";
    protected $fillable = [
        'image_path',
        'image_alt',
        'product_id',
        "file_extension",
        "mime_type",
        "file_size",
        "file_name",
    ];
}
