import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="h-[calc(100vh-260px)] justify-center flex-col flex items-center gap-3">
      <h1 className="text-9xl">404</h1>
      <p>This page could not be found.</p>
      <Link href={"/"}>
        <div className="text-black text-center ">
          <span className="underline">GO BACK HOME</span> &#8634;
        </div>
      </Link>
    </div>
  );
};

export default NotFound;
