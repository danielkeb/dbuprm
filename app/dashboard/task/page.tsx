"use client"
import { Suspense } from "react";
import UserListPage from "./index"

const Page=()=>{
    return(
        <main>
            <Suspense fallback={<div>task operation ...</div>}>
            <UserListPage/>
            </Suspense>
            </main>
            
    
    )
}
export default Page;