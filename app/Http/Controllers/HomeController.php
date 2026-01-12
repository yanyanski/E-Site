<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function getHomeContentUi(Request $request){

        ///Handle if it's ajax or normal HTTP Request
        if($request ->ajax()){
            return view("contents.home") -> render();
        } else {
            return view("index", ["content" => "home"]);
        }
    }
}
