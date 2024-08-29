"use client";

import { Suspense } from "react";
import Reset from "./reset";



const Page: React.FC = () => {
        return (
            <Suspense fallback={<div>Loading Task Update...</div>}>
      <Reset/>
    </Suspense>
        );
};
export default Page;
