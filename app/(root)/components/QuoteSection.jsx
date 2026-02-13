import React from "react";
import QuoteCopy from "./QuoteCopy";
import Link from "next/link";

const QuoteSection = () => {
  return (
    <section className="bg-black relative sm:py-50 py-30 sm:px-30 px-6 gap-5 flex flex-col">
      <QuoteCopy>
        <p className="text-neutral-100 z-1 text-xl font-[480] text-pretty md:text-5xl lg:text-[3.5rem] text-left">
          Creativity is a conversation between vision and emotion. Through
          design and photography, moments become meaning — each one shaped to
          speak, move, and resonate.
        </p>
      </QuoteCopy>
      <div className="flex justify-start sm:justify-center">
        <Link href={"/about"}>
          <div className="btn-light max-sm:text-sm">
            <span>Explore more about me</span>
          </div>
        </Link>
      </div>
      <div className="absolute opacity-20 sm:w-130 w-100 h-auto top-[50%] left-[50%] translate-[-50%] z-0">
        <img src="/assets/icons/scribble.svg" className="" alt="" />
      </div>
    </section>
  );
};

export default QuoteSection;
