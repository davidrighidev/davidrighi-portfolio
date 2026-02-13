"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

import "./featuredsection.css";
import TitleCopy from "./TitleCopy";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.ticker.lagSmoothing(0);

const FeaturedWorkSection = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initAnimations = () => {
      const workItems = gsap.utils.toArray(".work-item");

      workItems.forEach((item) => {
        const img = item.querySelector(".work-item-img");
        const nameH1 = item.querySelector(".work-item-name h1");
        if (!nameH1 || !img) return;

        const split = new SplitText(nameH1, {
          type: "chars",
          mask: "chars",
        });

        gsap.set(split.chars, { y: "125%" });

        split.chars.forEach((char, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: `top+=${index * 25 - 250} top`,
            end: `top+=${index * 25 - 100} top`,
            scrub: 1,
            animation: gsap.fromTo(
              char,
              { y: "125%" },
              { y: "0%", ease: "none" },
            ),
            invalidateOnRefresh: true,
          });
        });

        ScrollTrigger.create({
          trigger: item,
          start: "top bottom",
          end: "top center",
          scrub: 0.5,
          animation: gsap.fromTo(
            img,
            {
              clipPath: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)",
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              ease: "none",
            },
          ),
          invalidateOnRefresh: true,
        });

        ScrollTrigger.create({
          trigger: item,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.5,
          animation: gsap.fromTo(
            img,
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)",
              ease: "none",
            },
          ),
          invalidateOnRefresh: true,
        });
      });

      ScrollTrigger.refresh();
    };

    const waitForFontsAndImages = async () => {
      if (document.fonts) await document.fonts.ready;

      const images = Array.from(document.images);
      await Promise.all(
        images
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              }),
          ),
      );

      initAnimations();
    };

    waitForFontsAndImages();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const works = [
    {
      src: "/assets/images/work/featured/work_01.jpg",
      title: "Japan",
      url: "japan",
    },
    {
      src: "/assets/images/work/featured/work_02.jpg",
      title: "Event Photography",
      url: "bdayevent",
    },
    {
      src: "/assets/images/work/featured/work_03.jpg",
      title: "Beachvolley",
      url: "beachvolley",
    },
    {
      src: "/assets/images/work/featured/work_04.jpg",
      title: "Dolomia Yachts",
      url: "dolomiayachts",
    },
  ];

  return (
    <>
      <section className="hero sm:p-5 p-5 relative w-screen h-[30vh] sm:h-[60vh] flex justify-between items-center overflow-hidden">
        <h1 className="uppercase lg:text-4xl text-2xl md:text-5xl font-medium leading-none">
          SELECTED WORKS
        </h1>
        <h1 className="uppercase text-neutral-500 lg:text-4xl sm:text-3xl text-md md:text-5xl font-medium leading-none">
          (19–25)
        </h1>
      </section>

      {works.map((work, i) => (
        <section
          key={i}
          className="work-item cursor-pointer relative w-screen overflow-hidden"
          onClick={() => router.push(`/work/${work.url}`)}
        >
          <div className="work-item-img">
            <img className="work-img" src={work.src} alt={work.title} />
          </div>
          <div className="work-item-name">
            <h1 className="uppercase text-center lg:text-8xl text-3xl md:text-5xl font-medium leading-none">
              {work.title}
            </h1>
          </div>
        </section>
      ))}

      <section className="outro p-8 relative w-screen h-[70svh] flex flex-col justify-center items-center overflow-hidden">
        <img
          className="absolute blur-[3px] -z-10 opacity-50"
          src="/assets/images/menu/img-4.jpg"
          alt=""
        />

        <TitleCopy>
          <h1 className="uppercase text-center lg:text-5xl text-3xl md:text-5xl font-medium leading-none">
            Let's connect!
          </h1>
        </TitleCopy>

        <button
          className="btn sm:mt-5 mt-2 text-[0.75rem] sm:text-[1rem]"
          onClick={() => router.push("/connect")}
        >
          <span>Contact me ;-)</span>
        </button>
      </section>
    </>
  );
};

export default FeaturedWorkSection;
