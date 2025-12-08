<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Shop')</title>

    <link rel="preload" href={{ Vite::asset("resources/css/app.css") }} as="style">
    <link rel="stylesheet" href={{ Vite::asset("resources/css/app.css") }} media="print" onload="this.media='all'">

    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap" as="style">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap">

    @if(isset($is_admin) && $is_admin)
        @vite(["resources/js/admin_app.ts"], "defer")
    @else
        @vite(['resources/js/app.ts'], "defer")
    @endif

</head>