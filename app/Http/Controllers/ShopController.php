<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function getShoppingContentUi(Request $request) {
        ///Handle if it's ajax or normal HTTP Request
        if($request ->ajax()){
            return view("contents.purchase") -> render();
        } else {
            return view("index", ["content" => "purchase"]);
        }
    }
}
