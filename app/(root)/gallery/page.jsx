import React from "react";
import Gallery from "./Gallery";
import Copy from "../components/Copy";
export const metadata = {
  title: "Gallery",
};

const page = () => {
  return (
    <>
      <section className="bg-white w-full pt-30 px-5 sm:px-20">
        <div className="flex items-baseline justify-between">
          <div className="flex gap-5 flex-col">
            <div className="text-black tracking-tight font-medium leading-tight text-5xl md:text-8xl">
              <Copy delay={0.8} animateOnScroll={false} className="">
                <p>My visual</p>
                <p>Diary</p>
              </Copy>
            </div>
            <div className="max-w-200 text-wrap">
              These photographs are more than captured scenes — they are stories
              paused in time. Moments of connection, exploration, and beauty
              found along the way. Every frame holds a piece of the places I’ve
              been, the people I’ve met, and the way I see the world.
            </div>
          </div>
          <div className="font-accent hidden lg:flex italic text-neutral-600 text-5xl mr-20 flex-col">
            <div>light.</div>
            <div className="text-neutral-400">emotion.</div>
            <div>movement.</div>
          </div>
        </div>

        <Gallery />
      </section>
    </>
  );
};

export default page;
