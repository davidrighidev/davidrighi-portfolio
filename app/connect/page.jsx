"use client";
import React from "react";
import Copy from "../components/Copy";

const Connect = () => {
  return (
    <>
      <section className="bg-white w-full pt-30 pb-10 sm:pb-20 px-5 sm:px-20">
        <div className="m">
          <div className="text-black tracking-tight font-medium text-5xl md:text-8xl flex flex-col gap-2">
            <Copy delay={0.8} animateOnScroll={false}>
              <p>Let's make</p>
              <p>it happen</p>
            </Copy>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-2">
              <form className="w-full bg-neutral-100 p-7">
                <div className="mt-7">
                  <input
                    type="text"
                    name="name"
                    required
                    className="text-xl py-2 w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-400 outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div className="mt-7">
                  <input
                    type="email"
                    name="email"
                    required
                    className="text-xl py-2 w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-400 outline-none"
                    placeholder="Your Email"
                  />
                </div>
                <div className="mt-7">
                  <textarea
                    placeholder="Your Message"
                    name="message"
                    required
                    className="text-xl py-2 w-full h-32 bg-transparent border-b-2 border-gray-200 focus:border-gray-400 outline-none resize-none"
                  ></textarea>
                </div>
                <button className="text-xl btn mt-7" type="submit">
                  <span>SEND MESSAGE</span>
                </button>
              </form>
            </div>

            <div className="flex-1">
              <Copy delay={0.8} animateOnScroll={false}>
                <p className="text-2xl">
                  Let’s get in touch and create incredible things together,
                  turning ideas into reality with passion, creativity, and
                  innovation. Available for work and always looking for exciting
                  projects!
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Connect;
