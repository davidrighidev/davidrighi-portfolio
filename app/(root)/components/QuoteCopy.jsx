"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const QuoteCopy = ({ children, animateOnScroll = true, delay = 0 }) => {
  const containerRef = useRef(null);
  const splitRef = useRef([]);
  const triggers = useRef([]);
  const words = useRef([]);

  const cleanup = () => {
    splitRef.current.forEach((split) => split?.revert());
    triggers.current.forEach((t) => t?.kill());
    splitRef.current = [];
    triggers.current = [];
    words.current = [];
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
        type: "words",
        wordsClass: "word++",
      });

      splitRef.current.push(split);
      words.current.push(...split.words);
    });

    // Initial state: slightly below and invisible
    gsap.set(words.current, { y: 8, opacity: 0 });

    const animationProps = {
      y: 0,
      opacity: 1,
      duration: 0.85,
      stagger: 0.05,
      ease: "power2.out",
      delay,
    };

    if (animateOnScroll) {
      const tween = gsap.to(words.current, {
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
      gsap.to(words.current, animationProps);
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

export default QuoteCopy;
