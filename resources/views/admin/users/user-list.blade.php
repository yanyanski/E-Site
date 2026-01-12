{{-- 

<!-- Create header names -->
<div id="user-list-header-container" class="flex gap-1 px-6 bg-slate-200 py-1 mt-3 mx-2">
    <div class="w-[30%]"> 
        <h1 class="hover:bg-slate-100 hover:cursor-pointer transition duration-150
        flex justify-start items-center rounded w-full text-green-700 text-lg">
            User
        </h1>
    </div>

    <div class="w-[30%]"> 
        <h1 class="hover:bg-slate-100 hover:cursor-pointer transition duration-150
        flex justify-center items-center rounded w-full text-green-700 text-lg">
            Status
        </h1>
    </div>

    <div class="w-[30%]"> 
        <h1 class="hover:bg-slate-100 hover:cursor-pointer transition duration-150
        flex justify-center items-center rounded w-full text-green-700 text-lg">
            Created At
        </h1>
    </div>


    <div class="w-[10%]"> 
        <h1 class="hover:bg-slate-100 hover:cursor-pointer transition duration-150
        flex justify-center items-center rounded w-full text-green-700 text-lg">
            Actions
        </h1>
    </div>

</div>

<div id="users-list-csrf-container" class="hidden">
    @csrf
</div>



<div id="user-list-content-container" class="flex flex-col gap-1 bg-slate-100 py-1 mx-2">

    {{-- <div class="user-list-contents gap-1 py-[1px] mt-2 relative loading-border-top opacity-90">
         <!-- Create a user row -->
        <div class="flex w-full bg-slate-300 p-2 rounded-xl">
            <div class="w-[30%]">
                <div class="grow flex gap-2">
                    <img src="/icons/profile.png" alt="User Icon" class="w-[40px]">
                    <h1 id="user" class="w-full flex items-center font-bold text-green-800 text-lg">User</h1>
                </div>
            </div>

            <div class="w-[30%] flex"> 

                <h1 class="flex justify-center items-center rounded w-full text-slate-800 text-md gap-2">

                    Active
                </h1>
            </div>

            <div class="w-[30%]"> 
                <div class="flex gap-2 grow items-center justify-center w-full "> 
                    <img src="/icons/calendar.png" alt="User Icon" class="w-[40px] flex rounded justify-center">
                    <h1 class="flex rounded text-slate-800 text-lg justify-center">
                        Created At
                    </h1>
                </div>
            </div>


            <div class="w-[10%]"> 
                <div class="flex gap-2 grow items-center justify-center w-full hover:bg-slate-200 rounded-lg py-1 transition duration-100 hover:cursor-pointer"> 
                    <img src="/icons/edit.png" alt="User Icon" class="w-[30px] items-center flex rounded justify-center pointer-events-none">
                    <h1 class="flex rounded text-slate-800 text-lg justify-center items-center pointer-events-none">
                        ...
                    </h1>
                </div>
            </div>
        </div>
    
    </div> --}}
   

</div>


{{-- <dialog id="factories-buttonic-modal" class="px-5 py-2 rounded-xl border-[2px] border-green-300" open="" style="position: fixed; width: 250px; height: 200px; left: 559px; top: 123px; margin: 0px;">

                <div class="flex w-full items-center justify-end">
                    <p id="factories-buttonic-title" class="flex items-center justify-center w-full font-bold text-slate-600 justify-self-start">Test User</p>

                    <h1 id="factories-buttonic-close-button" class="flex text-lg text-slate-600 hover:cursor-pointer transition-all hover:text-slate-800 hover:bg-slate-200 p-2 rounded-md">X</h1>
                </div>
            

            <div class="divider flex items-center justify-center">
                    <h1 id="factories-buttonic-extra-title" class="flex items-center justify-center text-xs text-slate-700 px-1">Actions</h1>
            </div>
            

                <div class="w-full flex flex-col gap-2 py-2">
            

                    <button id="user-row-edit-block-" class="w-full flex items-center justify-center bg-slate-100 py-2 
                    rounded hover:bg-slate-200 duration-100 transition-all hover:gap-3 gap-1 outline-none border-none">
                    <img src="/icons/block.png" class="w-[25px] justify-self-start flex pointer-events-none mx-1">    
                    Block
                    </button>
                

                    <button id="user-row-edit-change-status-" class="w-full flex items-center justify-center bg-slate-100 py-2 
                    rounded hover:bg-slate-200 duration-100 transition-all hover:gap-3 gap-1 outline-none border-none">
                    <img src="/icons/modify.png" class="w-[25px] justify-self-start flex pointer-events-none mx-1">    
                    Change Status
                    </button>
                

                </div>
            
</dialog> --}} --}}
