"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Copy = ({ children, animateOnScroll = true, delay = 0 }) => {
  const containerRef = useRef(null);
  const splitRef = useRef([]);
  const triggers = useRef([]);
  const lines = useRef([]);

  const cleanup = () => {
    splitRef.current.forEach((split) => split?.revert());
    triggers.current.forEach((t) => t?.kill());

    splitRef.current = [];
    triggers.current = [];
    lines.current = [];
  };

  const initSplit = () => {
    const container = containerRef.current;
    if (!container) return;

    cleanup();

    const elements = container.hasAttribute("data-copy-wrapper")
      ? Array.from(container.children)
      : [container];

    elements.forEach((element) => {
      const split = new SplitText(element, {
        type: "lines",
        mask: "lines",
        linesClass: "line++",
      });

      splitRef.current.push(split);
      lines.current.push(...split.lines);
    });

    gsap.set(lines.current, { y: "100%" });

    const animationProps = {
      y: "0%",
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      delay,
    };

    if (animateOnScroll) {
      const tween = gsap.to(lines.current, {
        ...animationProps,
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          once: true,
        },
      });

      if (tween && tween.scrollTrigger) {
        triggers.current.push(tween.scrollTrigger);
      }
    } else {
      gsap.to(lines.current, animationProps);
    }
  };

  useGSAP(
    () => {
      const runSplit = () => {
        initSplit();
        ScrollTrigger.refresh();
      };

      const safeRun = () => {
        if (document.fonts?.ready) {
          document.fonts.ready.then(runSplit);
        } else {
          runSplit();
        }
      };

      safeRun();
      window.addEventListener("load", runSplit);

      return () => {
        cleanup();
        window.removeEventListener("load", runSplit);
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] },
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
};

export default Copy;
