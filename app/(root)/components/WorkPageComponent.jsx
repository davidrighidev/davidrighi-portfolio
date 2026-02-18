"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { workPages } from "../../constants/workData"; // adjust path if needed
import Image from "next/image";
import Copy from "./Copy";

gsap.registerPlugin(SplitText);

const WorkPageComponent = ({ data }) => {
  const allProjects = Object.values(workPages);

  // remove current project
  const filteredProjects = allProjects.filter(
    (project) => project.title !== data.title,
  );

  // shuffle
  const shuffledProjects = filteredProjects.sort(() => 0.5 - Math.random());

  // take 2
  const relatedProjects = shuffledProjects.slice(0, 2).map((project) => ({
    title: project.workCardTitle,
    src: project.thumbnail,
    url: project.url,
    strokeColor: project.strokeColor, // you can randomize this later if you want
  }));

  const [columnsCount, setColumnsCount] = useState(2);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering (prevents hydration mismatch)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive column logic (same as collections)
  useEffect(() => {
    if (!isClient) return;

    const getColumns = () => {
      const w = window.innerWidth;
      if (w > 1920) return 3;
      if (w > 1366) return 2;
      if (w > 1024) return 2;
      return 2;
    };

    const handleResize = () => {
      setColumnsCount(getColumns());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  // Distribute images left → right (same logic as before)
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnsCount }, () => []);
    data.images.forEach((src, index) => {
      cols[index % columnsCount].push({ src, index });
    });
    return cols;
  }, [columnsCount]);

  const relatedRef = useRef(null);

  useEffect(() => {
    if (!relatedRef.current) return;

    const ctx = gsap.context(() => {
      const cards = relatedRef.current.querySelectorAll(".card-container");
      cards.forEach((card) => {
        const paths = card.querySelectorAll(".svg-stroke path");
        const title = card.querySelector(".card-title h3");
        if (!title) return;

        const split = new SplitText(title, { type: "words" });
        gsap.set(split.words, { yPercent: 100 });

        paths.forEach((path) => {
          const length = path.getTotalLength();
          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length;
        });

        let tl;
        card.addEventListener("mouseenter", () => {
          if (tl) tl.kill();
          tl = gsap.timeline();

          paths.forEach((path) => {
            tl.to(
              path,
              {
                strokeDashoffset: 0,
                attr: { "stroke-width": 130 },
                duration: 1.5,
                ease: "power2.out",
              },
              0,
            );
          });

          tl.to(
            split.words,
            { yPercent: 0, duration: 0.75, ease: "power3.out", stagger: 0.075 },
            0.35,
          );
        });

        card.addEventListener("mouseleave", () => {
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
    }, relatedRef);

    return () => ctx.revert();
  }, [isClient]);

  if (!isClient) return null;

  return (
    <section className="w-full bg-white relative">
      <div className="lg:h-screen h-[55vh] bg-black relative">
        <div className="w-full h-full">
          <Image
            quality={100}
            src={data.thumbnail}
            alt=""
            width={1000}
            height={1000}
          />
        </div>

        <Copy animateOnScroll={false}>
          <div className="absolute overflow-hidden w-full bottom-[10%] left-1/2 translate-x-[-50%] z-2 tracking-wider font-medium uppercase text-white text-5xl text-center lg:text-8xl">
            {data.workCardTitle}
          </div>
        </Copy>
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-black/10"></div>
      </div>
      <div className="lg:grid grid-cols-12 gap-10 lg:px-10 px-5 mt-20 lg:mt-30 mb-10 lg:mb-30">
        <div className="col-span-6 col-start-7">
          <div className="lg:text-[14px] lg:leading-3.5 text-[12px] leading-3 uppercase font-mono lg:mb-6 mb-4 text-neutral-500">
            {data.client}
          </div>
          <div className="lg:text-[54px] lg:leading-16 text-[34px] leading-10 lg:tracking-[-2px] mb-5.5">
            {data.title}
          </div>
          <div className="lg:text-[30px] lg:leading-9.75 text-[24px] leading-6.25 lg:tracking-[-1.5px] lg:mb-12 mb-10">
            <Copy>
              <div>{data.description}</div>
            </Copy>
          </div>
          <div className="mb-11 lg:w-3/5">
            <div className="lg:text-[14px] lg:leading-3.5 text-[12px] leading-3 uppercase font-mono mb-4 text-neutral-500">
              Work
            </div>
            <div className="text-[20px] leading-7">
              {data.work.map((item, index) => (
                <span key={index}>
                  {item}
                  {index !== data.work.length - 1 && " · "}
                </span>
              ))}
            </div>
          </div>
          {data.website && (
            <div className="mb-11 lg:w-3/4">
              <div className="lg:text-[14px] lg:leading-3.5 text-[12px] leading-3 uppercase font-mono mb-4 text-neutral-500">
                Website
              </div>
              <div className="text-[20px] leading-7">
                <a
                  href={`https://${data.website}`}
                  className="hover:text-[#15b1f5] transition-colors duration-350 underline"
                >
                  {data.website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:grid grid-cols-8 gap-10 lg:px-10 px-0 mb-10 lg:mb-15">
        {data.video && (
          <div className="col-span-8">
            <div className="video-autoplay">
              <video
                preload="none"
                style={{ aspectRatio: 16 / 9 }}
                loop
                muted
                playsInline
                autoPlay
              >
                <source src={data.video} type="video/mp4" />
              </video>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 lg:px-9 px-0">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2 flex-1">
            {column.map((img, i) => (
              <div key={i} className="relative overflow-hidden">
                <Image
                  src={img.src}
                  alt=""
                  width={1000}
                  height={1000}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Related Projects */}
      <div
        ref={relatedRef}
        className="lg:grid grid-cols-12 gap-10 gap-y-6 lg:px-10 px-5 pt-40 lg:pb-30 pb-20 related-projects"
      >
        <div className="col-span-12">
          <div className="lg:text-[64px] lg:leading-16 text-[34px] leading-9 lg:tracking-[-2.5px] lg:mb-4 mb-10">
            Other Projects
          </div>
        </div>

        {relatedProjects.map((item, i) => (
          <div key={i} className="lg:col-span-6 col-span-12 cursor-pointer">
            <div className="card-container relative flex-1 aspect-[16/9.5] mb-5 rounded-2xl overflow-hidden">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* SVG stroke layers */}
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkPageComponent;
