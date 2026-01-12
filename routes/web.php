<?php

use App\Http\Controllers\ShopController;
use App\Http\Controllers\AdminControllers\CreateUserController;
use App\Http\Controllers\AdminControllers\AdminController;
use App\Http\Controllers\AdminControllers\ProductController;
use App\Http\Controllers\AdminControllers\AdminUsers;
use App\Http\Controllers\AdminControllers\ProductCategoryController;
use App\Http\Controllers\AdminControllers\ProductTypeController;
use App\Http\Controllers\AdminControllers\ProductVariantController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\HomeController;

use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('index');
});

Route::get('/w', function () {
    return view('welcome');
});

Route::prefix("home") -> group(function() {
    Route::get("/", [HomeController::class, "getHomeContentUi"]);
});

Route::prefix("shop") -> group(function() {
    Route::get('/', [ShopController::class, "getShoppingContentUi"]);
});

Route::prefix("login") -> group(function() {
    Route::post("/auth", [LoginController::class, "checkLoginCredent"]);
    Route::get("/", [LoginController::class, "getLoginContentUi"])
    ->middleware("isAuthenticated")
    ->name("login");
});

Route::get("logout", [LoginController::class, "logout"]); 

Route::prefix("admin") 
    -> middleware("auth")
    -> group(function() {
    Route::get("/", [AdminController::class, "getAdminIndex"]);
    Route::get("/create-user", [CreateUserController::class, "getCreateUserUi"]);
    Route::get("/products", [ProductController::class, "getProductIndex"]);

    Route::prefix("users") -> group(function() {
        Route::get("/", [AdminUsers::class, "getUsers"]);
        Route::post("/add", [AdminUsers::class, "addUser"]);
        Route::post("/update", [AdminUsers::class, "addUser"]);
        Route::post("/paginated-users", [AdminUsers::class, "getPaginatedUsers"]);

        Route::post("/set-user-status", [AdminUsers::class, "setUserStatus"]);
    });

    Route::prefix("products") -> group(function() {

        Route::post("/add", [ProductController::class, "addProduct"]);
        Route::post("/update", [ProductController::class, "updateProduct"]);
        Route::prefix("variants") -> group(function(){
            Route::post("/add", [ProductVariantController::class, "addVariant"]);
            Route::post("/update", [ProductVariantController::class, "addVariant"]);
        });

        Route::prefix("categories") -> group(function() {
            Route::post("/add", [ProductCategoryController::class, "addCategory"]);
            Route::post("/update", [ProductCategoryController::class, "addCategory"]);
        });

        Route::prefix("product-types") -> group(function() {
            Route::post("/add", [ProductTypeController::class, "addProductType"]);
            Route::post("/update", [ProductTypeController::class, "addProductType"]);
        });
    });
});


Route::prefix("public") -> group(function() {
    Route::prefix("products") -> group(function() {
        Route::get("variants", [PublicController::class, "getVariants"]);
        Route::get("categories", [PublicController::class, "getCategories"]);
        Route::post("lists", [PublicController::class, "getProductList"]);
        Route::get("types", [PublicController::class, "getProductTypes"]);
        Route::POST("search", [PublicController::class, "searchProduct"]);
    });
    
    Route::prefix("icons") -> group(function() {
        Route::post("/", [PublicController::class, "getIcons"]);
    });
});

