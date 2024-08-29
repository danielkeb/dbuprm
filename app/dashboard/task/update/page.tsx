"use client"
import { Suspense } from "react";
import UserUpdatePage from "./id"

const Page=()=>{
    return(
        <Suspense fallback ={<div>loading to update ..</div>}>
            <UserUpdatePage/>
        </Suspense>
        
        
    )
}
export default Page;