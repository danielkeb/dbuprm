"use client";

import { Suspense } from "react";
import UserProfilePage from "./index";



const Page: React.FC = () => {
        return (
            <Suspense fallback={<div>Loading Task Update...</div>}>
      <UserProfilePage/>
    </Suspense>
        );
};
export default Page;
