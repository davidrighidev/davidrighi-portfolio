"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const TitleCopy = ({ children, animateOnScroll = true, delay = 0 }) => {
  const containerRef = useRef(null);
  const splitRef = useRef(null);
  const triggers = useRef([]);

  const initSplit = () => {
    if (!containerRef.current) return;

    // cleanup previous
    splitRef.current?.revert();
    triggers.current.forEach((t) => t.kill());
    triggers.current = [];

    // Split into chars
    const split = SplitText.create(containerRef.current, {
      type: "chars",
      charsClass: "char++",
    });
    splitRef.current = split;

    gsap.set(split.chars, { opacity: 0, y: "20%" });

    const animationProps = {
      opacity: 1,
      y: "0%",
      duration: 0.8,
      stagger: 0.025,
      ease: "power3.out",
      delay,
    };

    if (animateOnScroll) {
      const tween = gsap.to(split.chars, {
        ...animationProps,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });
      triggers.current.push(tween.scrollTrigger);
    } else {
      gsap.to(split.chars, animationProps);
    }

    ScrollTrigger.refresh();
  };

  useGSAP(
    () => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(initSplit);
      } else {
        initSplit();
      }

      return () => {
        splitRef.current?.revert();
        triggers.current.forEach((t) => t.kill());
        triggers.current = [];
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] },
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return <div ref={containerRef}>{children}</div>;
};

export default TitleCopy;
