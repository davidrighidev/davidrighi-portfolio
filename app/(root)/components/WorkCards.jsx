"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { workPages } from "../../constants/workData";

gsap.registerPlugin(SplitText);

const workItems = Object.values(workPages).map((project) => ({
  title: project.workCardTitle || project.client,
  src: project.thumbnail,
  strokeColor: project.strokeColor,
  url: project.url,
}));

const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size),
  );
};

const WorkCards = () => {
  const rows = chunkArray(workItems, 2);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const cardsContainer =
        containerRef.current.querySelectorAll(".card-container");

      cardsContainer.forEach((cardContainer) => {
        const paths = cardContainer.querySelectorAll(".svg-stroke path");
        const title = cardContainer.querySelector(".card-title h3");

        if (!title) return;

        // Split text
        const split = new SplitText(title, {
          type: "words",
        });

        gsap.set(split.words, { yPercent: 100 });

        // SVG stroke animation setup
        paths.forEach((path) => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length;
        });

        let tl;

        cardContainer.addEventListener("mouseenter", () => {
          if (tl) tl.kill();
          tl = gsap.timeline();

          paths.forEach((path) => {
            tl.to(
              path,
              {
                strokeDashoffset: 0,
                attr: { "stroke-width": 90 },
                duration: 1.5,
                ease: "power2.out",
              },
              0,
            );
          });

          tl.to(
            split.words,
            {
              yPercent: 0,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.075,
            },
            0.35,
          );
        });

        cardContainer.addEventListener("mouseleave", () => {
          if (tl) tl.kill();
          tl = gsap.timeline();

          paths.forEach((path) => {
            tl.to(
              path,
              {
                strokeDashoffset: path.getTotalLength(),
                attr: { "stroke-width": 20 },
                duration: 1,
                ease: "power2.out",
              },
              0,
            );
          });

          tl.to(
            split.words,
            {
              yPercent: 100,
              duration: 0.5,
              ease: "power3.out",
              stagger: { each: 0.05, from: "end" },
            },
            0,
          );
        });
      });
    }, containerRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <>
      <div ref={containerRef} className="py-2 lg:py-8 px-2 lg:px-6">
        <div className="p-4 lg:p-6 max-sm:text-center">
          <h1 className="">
            <span className="font-accent italic lg:text-4xl text-xl text-neutral-700">
              featured
            </span>
            <span className="font-medium lg:text-5xl text-2xl"> WORK</span>
          </h1>
        </div>
        {rows.map((row, rowIndex) => (
          <div
            className="row w-full px-4 lg:px-6 mb-4 lg:mb-6 max-lg:flex-col flex gap-4 lg:gap-6"
            key={rowIndex}
          >
            {row.map((item, i) => (
              <Link href={item.url} key={i} className="block flex-1">
                <div
                  className="card-container relative flex-1 aspect-[1.2/1] rounded-2xl overflow-hidden"
                  id={`card-${i + 1}`}
                  key={i}
                >
                  <div className="card-img">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="60vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="svg-stroke absolute top-1/2 left-1/2 translate-[-50%] scale-150 w-full h-full svg-stroke-1">
                    <svg
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 233.98"
                      className="h-full w-full object-cover"
                    >
                      <path
                        stroke={item.strokeColor}
                        strokeLinecap="round"
                        strokeWidth="20"
                        d="M232.39,30.56c-8.77-16-24.82-22.9-36.25-18.57-10.13,3.84-24.31,25.64,11.99,69.35,13.93,16.77,33.95,52.39,36.36,77.48.85,8.83,3.53,30.42-9.28,37.57-17.02,9.5-38.46,0-69.11-89.74C134.27,13.5,101.41,7.56,84.02,15.16c-12.25,5.35-30.06,23.43,23.87,89.29,60.12,76.92,50.39,98.43,38.46,110.07-10.11,9.86-41.7,13.6-72.41-65.05-20.86-53.42-41.79-65.22-53.57-60.49-11.4,4.58-25.2,14.59,39.83,111.4,3.18,4.73,9.31,14.96,5.54,21.14-3.21,5.26-25.7.29-43.82-37.06"
                      />
                    </svg>
                  </div>

                  <div className="svg-stroke absolute top-1/2 left-1/2 translate-[-50%] scale-150 w-full h-full svg-stroke-2">
                    <svg
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 233.98"
                      className="h-full w-full object-cover"
                    >
                      <path
                        stroke="#e0e0e0"
                        strokeLinecap="round"
                        strokeWidth="20"
                        d="M32.86,17.46C15.66,26.88,8.24,44.14,12.9,56.43c4.13,10.89,27.57,26.14,74.57-12.89,18.03-14.98,39.63-28.72,66.61-31.31,9.5-.91,31.46-3.02,40.4,9.98,7.62,11.08,3.1,23.75-5.7,34.92-11.68,14.83-29.32,22.44-74.09,31.61C19.46,108.25,11.29,143.26,19.46,161.96c5.75,13.17,35.74,33.27,95.46-21.81,45.57-42.03,70.17-44.89,77.18-46.17,8.44-1.53,38.07-6.91,48.96,8.56,8.74,12.42,6.86,51.23-80.33,76.53-106.47,30.9-107.28,62.91-102.2,75.58,4.92,12.26,25.67,43.26,156.94-52.04,4.96-3.6,16.09-10.01,22.73-5.95,5.66,3.45,18.54,20.44-48.48,56.09"
                      />
                    </svg>
                  </div>

                  <div className="card-title absolute lg:bottom-8 bottom-4 lg:left-8 left-4 overflow-hidden">
                    <h3 className="text-[clamp(20px,9vw,48px)] font-[450] leading-tight tracking-[-0.025rem] text-black">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default WorkCards;
