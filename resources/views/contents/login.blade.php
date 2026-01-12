

<div class="w-full h-[calc(100vh-50px)] px-[20px] items-center justify-center flex">
    <div id="site-login-form-wrapper" class="w-full h-fit py-10 max-w-[500px] rounded-xl relative 
    border-slate-600 border-[1px] bg-gradient-to-t from-slate-700 via-slate-600 to-slate-700"
    > 
        <h1 class="font-bold text-2xl text-green-200 w-full flex items-center justify-center"> Login </h1>

        <!-- Login Form -->
        <form id="site-login-form" class='w-full h-full px-5 py-2 gap-5 flex flex-col'>
            @csrf
            <div>
                <h1 class="text-slate-100">Username</h1>
                <input class="w-full" placeholder="Username" name="username">
            </div>
            
            <div>
                <h1 class="text-slate-100">Password</h1>
                <input class="w-full" placeholder="Password" type="password" name="password">
            </div>

            <button type="submit" class='bg-green-700 py-2 px-2 rounded-md text-slate-200 font-bold'> Login</button>
        </form>
        <h6 id="login-form-error-label" class='text-red-400 px-5'>!Something went wrong</h6>
    </div>
</div>