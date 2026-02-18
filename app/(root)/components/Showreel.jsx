"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Showreel = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const element = videoRef.current;

    gsap.fromTo(
      element,
      { scale: 0.6 },
      {
        scale: 1,

        duration: 1.5,
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      },
    );
  }, []);

  return (
    <section className="px-2 sm:px-10 py-10 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Container für 16:9 */}
        <div className="relative w-full pb-[56.25%]">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
            src="/assets/videos/test.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  );
};

export default Showreel;
