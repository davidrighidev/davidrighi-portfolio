"use client";
import React, { useEffect } from "react";
import gsap from "gsap";

const HeroSection = () => {
  useEffect(() => {
    const heroContent = document.querySelector(
      ".hidden.flex-col.uppercase.font-semibold",
    );

    // Make it visible before animating
    if (heroContent) {
      heroContent.classList.remove("hidden");
      heroContent.classList.add("flex");
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 1.1,
          ease: "power4.out",
        },
      });

      const reveals = gsap.utils.toArray(".overflow-hidden > div");

      // top text row
      tl.from(
        reveals[0],
        {
          yPercent: 100,
        },
        0,
      );

      // images
      tl.from(
        ".flex-col.lg\\:flex-row img",
        {
          yPercent: 100,
          duration: 1.25,
          ease: "expo.out",
        },
        0.25,
      );

      // bottom text row
      tl.from(
        reveals[reveals.length - 1],
        {
          yPercent: 100,
        },
        0.15,
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-[60vh] sm:h-screen w-screen bg-black">
      <img
        src="/assets/images/hero/hero.webp"
        alt="Hero background"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
      {/* next div is hidden */}
      <div className="hidden flex-col uppercase font-semibold transform-none absolute bottom-[2vh] lg:bottom-[7vh] left-8 right-8">
        <div className="overflow-hidden max-lg:hidden mb-2 lg:mb-0 lg:w-full relative mx-auto lg:mx-0">
          <div className="flex justify-between w-full transform-none">
            <p className="text-[clamp(14px,1.2vw,20px)] text-neutral-300 uppercase block">
              A
            </p>
            <p className="text-[clamp(14px,1.2vw,20px)] text-neutral-300 uppercase absolute left-1/2 -translate-x-1/2">
              Seriously
            </p>
            <p className="text-[clamp(14px,1.2vw,20px)] text-neutral-300 uppercase block">
              Good
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-2 lg:gap-0">
          <div className="overflow-hidden lg:mr-[4vw]">
            <div className="transform-none">
              <img
                src="assets/images/hero/David.png"
                alt="David"
                className="lg:h-[10vw] h-[7vw] w-auto object-contain pointer-events-none"
              />
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="transform-none">
              <img
                src="assets/images/hero/Righi.png"
                alt="Righi"
                className="lg:h-[10vw] h-[7vw] w-auto object-contain pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden max-lg:hidden mt-2 lg:mt-0 lg:w-full relative mx-auto lg:mx-0">
          <div className="flex justify-between w-full transform-none">
            <p className="text-[clamp(14px,1.2vw,20px)] text-neutral-300 uppercase block">
              PHOTOGRAPHER
            </p>
            <p className="text-[clamp(14px,1.2vw,20px)] italic text-neutral-300/80 uppercase absolute left-1/2 -translate-x-1/2">
              &
            </p>
            <p className="text-[clamp(14px,1.2vw,20px)] text-neutral-300 uppercase block">
              DESIGNER
            </p>
          </div>
        </div>
      </div>

      <div className="absolute overflow-hidden opacity-85 text-neutral-100 w-auto h-7 md:h-9 top-46 right-[5vw] md:top-[26vh] md:right-[21vw] z-0">
        <img
          src="/assets/images/hero/yup-thats-me.png"
          alt=""
          className="rotate-5 w-full h-full"
        />
      </div>
      <div className="absolute overflow-hidden w-auto h-11 p-2 md:h-18 top-50 right-[16vw] md:top-[30vh] md:right-[26vw] z-0">
        <img
          src="/assets/icons/scribble-arrow.svg"
          alt=""
          className="rotate-30 w-full h-full"
        />
      </div>
    </section>
  );
};

export default HeroSection;
