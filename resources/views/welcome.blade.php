<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    @vite('resources/css/app.css')
    @vite('resources/js/test.ts')
  </head>
<body class='bg-slate-800'>
  
  <div class="w-full bg-green-200 h-[100vh]">

    <!-- Heading part -->
    <div class="w-full h-[50px] bg-slate-200 flex">

      <!-- Columns -->
      <div class="grow flex items-center justify-center">
        <div class="w-full flex gap-1 items-center justify-center">
          <h1 class="font-bold text-slate-600">Hello </h1>
        </div>
      </div>
    </div>

    
    <!-- Row Part -->
    <div class="w-full h-full items-center justify-center">

      <!-- Columns -->
      <div clas="w-full flex items-center justify-center">
        <div class="w-full flex gap-1 items-center justify-center">
          <h1 class="font-bold text-slate-600">Hello </h1>
        </div>
      </div>

    </div>
  </div>
</body>
</html>