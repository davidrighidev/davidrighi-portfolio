import React from "react";
import Gallery from "./Gallery";
import Copy from "../components/Copy";
export const metadata = {
  title: "Gallery",
};

const page = () => {
  return (
    <>
      <section className="bg-white w-full pt-30 pb-10 sm:pb-20 px-5 sm:px-20">
        <div className="">
          <div className="text-black tracking-tight font-medium text-5xl md:text-8xl flex flex-col gap-2">
            <Copy delay={0.8} animateOnScroll={false}>
              <p>My visual</p>
              <p>Diary</p>
            </Copy>
          </div>
        </div>
        <Gallery />
      </section>
    </>
  );
};

export default page;
