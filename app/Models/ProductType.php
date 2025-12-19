<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'product_type',
    ];

    public function infos()
    {
        return $this->hasMany(ProductInfo::class, 'product_type_id');
    }
}
