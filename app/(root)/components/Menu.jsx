"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuLinks = [
    { path: "/", label: "Index", prevImg: "/assets/images/menu/hero.webp" },
    { path: "/about", label: "About", prevImg: "/assets/images/cartoon.png" },
    {
      path: "/gallery",
      label: "Gallery",
      prevImg: "/assets/images/menu/img-3.jpg",
    },
    {
      path: "/connect",
      label: "Connect",
      prevImg: "/assets/images/menu/img-4.jpg",
    },
  ];

  const containerRef = useRef(null);
  const navRef = useRef(null);
  const menuPreviewImgRef = useRef(null);
  const menuOpenTextRef = useRef(null);
  const menuCloseTextRef = useRef(null);

  const tl = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [useWhite, setUseWhite] = useState(false);

  /* ------------------------------------------------------------------
     adaptive nav color (brightness sampling)
  ------------------------------------------------------------------ */

  const parseRGB = (rgbStr) => {
    const m = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return { r: 255, g: 255, b: 255 };
    return { r: +m[1], g: +m[2], b: +m[3] };
  };

  const brightness = ({ r, g, b }) => 0.299 * r + 0.587 * g + 0.114 * b;

  const getEffectiveBgColor = (el) => {
    while (el && el !== document.documentElement) {
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        return bg;
      }
      el = el.parentElement;
    }
    return "rgb(255,255,255)";
  };

  const sampleUnderNav = useCallback(() => {
    if (isOpen) {
      setUseWhite(true);
      return;
    }

    const nav = navRef.current;
    if (!nav) return;

    const rect = nav.getBoundingClientRect();
    const y = rect.top + rect.height / 2;

    const xs = [0.15, 0.35, 0.55, 0.75, 0.9].map(
      (p) => rect.left + rect.width * p,
    );

    const prev = nav.style.pointerEvents;
    nav.style.pointerEvents = "none";

    const values = xs.map((x) => {
      const el = document.elementFromPoint(x, y);
      const bg = getEffectiveBgColor(el || document.body);
      return brightness(parseRGB(bg));
    });

    nav.style.pointerEvents = prev;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    setUseWhite(avg < 160);
  }, [isOpen]);

  // scroll + resize (rAF throttled)
  useEffect(() => {
    let raf = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        sampleUnderNav();
        raf = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sampleUnderNav);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sampleUnderNav);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sampleUnderNav]);

  // re-sample on route / menu
  useEffect(() => {
    const t = setTimeout(sampleUnderNav, 50);
    return () => clearTimeout(t);
  }, [pathname, isOpen, sampleUnderNav]);

  const textTone = `transition-colors duration-300 ${
    useWhite ? "text-white" : "text-black"
  }`;

  const fillTone = useWhite ? "#ffffff" : "#000000";

  /* ------------------------------------------------------------------
     menu navigation
  ------------------------------------------------------------------ */

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (!isOpen) return router.push(path);

    toggleMenu();
    router.push(path);
  };

  /* ------------------------------------------------------------------
     menu animation
  ------------------------------------------------------------------ */

  useGSAP(
    () => {
      gsap.set(".menu-overlay", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      });

      gsap.set(".menu-links .link", { y: 75, opacity: 0 });

      tl.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            // menu ist jetzt WIRKLICH zu → Farbe neu bestimmen
            requestAnimationFrame(() => {
              sampleUnderNav();
            });
          },
        })
        .to(".menu-overlay", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.1,
          ease: "power4.inOut",
        })
        .to(
          ".menu-links .link",
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.75",
        );
    },
    { scope: containerRef },
  );

  /* ------------------------------------------------------------------
     image hover preview
  ------------------------------------------------------------------ */

  const cleanupImages = () => {
    const imgs = menuPreviewImgRef.current.querySelectorAll("img");
    if (imgs.length > 3) {
      for (let i = 0; i < imgs.length - 3; i++) imgs[i].remove();
    }
  };

  const resetPreviewImage = () => {
    menuPreviewImgRef.current.innerHTML = "";
    const img = document.createElement("img");
    img.src = "/assets/images/menu/sunset.JPG";
    menuPreviewImgRef.current.appendChild(img);
  };

  const handleLinkHover = useCallback(
    (src) => {
      if (!isOpen || !src) return;

      const imgs = menuPreviewImgRef.current.querySelectorAll("img");
      if (imgs.length && imgs[imgs.length - 1].src.endsWith(src)) return;

      const img = document.createElement("img");
      img.src = src;
      img.style.opacity = 0;
      img.style.transform = "scale(1.2) rotate(2deg)";

      menuPreviewImgRef.current.appendChild(img);
      cleanupImages();

      gsap.to(img, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "power3.out",
      });
    },
    [isOpen],
  );

  /* ------------------------------------------------------------------
     menu toggle
  ------------------------------------------------------------------ */

  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse();
      resetPreviewImage();

      gsap.to(menuCloseTextRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(menuOpenTextRef.current, {
        opacity: 1,
        y: 0,
        delay: 0.2,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      tl.current.play();

      gsap.to(menuOpenTextRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(menuCloseTextRef.current, {
        opacity: 1,
        y: 0,
        delay: 0.2,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    setIsOpen(!isOpen);
  };

  /* ------------------------------------------------------------------
     render
  ------------------------------------------------------------------ */

  return (
    <div ref={containerRef}>
      <nav
        ref={navRef}
        className="nav fixed top-0 left-0 w-full px-5 py-3 flex justify-between items-center z-50"
      >
        <div className="logo w-10">
          <Link href="/">
            <svg
              id="logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 133.21"
              fill={`${fillTone}`}
            >
              <path d="M137.41,45.55c0,8.75-1.28,17.38-3.83,25.88s-6.35,16.46-11.39,23.87c-5.04,7.42-11.12,13.94-18.22,19.59-7.11,5.65-15.19,10.12-24.24,13.39-9.05,3.29-18.98,4.92-29.8,4.92-1.82,0-4.23-.06-7.2-.19-2.98-.12-6.1-.21-9.39-.27-3.28-.07-6.5-.1-9.66-.1-2.8,0-5.68.03-8.65.1-2.98.06-5.78.12-8.39.18-2.61.07-4.83.16-6.65.27l.55-3.65c3.89-.24,6.95-.73,9.2-1.45,2.25-.73,4.03-2.19,5.38-4.38,1.33-2.19,2.55-5.47,3.64-9.84L42.65,23.49c1.09-3.89,1.64-6.95,1.64-9.2s-.91-3.86-2.74-4.83c-1.82-.97-4.98-1.52-9.48-1.64l.55-3.65c1.94.13,4.29.24,7.02.36,2.74.13,5.68.19,8.84.19h8.93c2.68-.12,5.71-.21,9.11-.27,3.4-.06,6.75-.12,10.03-.19,3.28-.06,6.07-.09,8.38-.09,17.38,0,30.46,3.49,39.28,10.48,8.8,6.99,13.21,17.29,13.21,30.89ZM48.48,129.93c8.87,0,16.86-1.61,23.97-4.84,7.1-3.22,13.39-7.71,18.87-13.48,5.47-5.77,10.02-12.42,13.67-19.96,3.64-7.53,6.38-15.65,8.2-24.33,1.82-8.68,2.73-17.59,2.73-26.7,0-10.93-2.8-19.19-8.38-24.78-5.59-5.58-14.71-8.38-27.34-8.38-3.52,0-6.26.42-8.19,1.28-1.95.85-3.53,2.37-4.74,4.55-1.22,2.19-2.43,5.47-3.65,9.84l-23.87,91.13c-.98,3.65-1.52,6.65-1.65,9.03-.12,2.37.58,4.07,2.1,5.1,1.52,1.03,4.29,1.55,8.29,1.55Z" />
              <path d="M151.92,133.07V2.49h21.51v130.58h-21.51ZM202.81,76.24h-35.33v-13.25h32.45c8.06,0,14.24-1.95,18.53-5.86,4.28-3.9,6.43-9.18,6.43-15.84s-2.15-11.74-6.43-15.65c-4.29-3.91-10.35-5.86-18.15-5.86h-32.83V2.49h33.41c14.08,0,25.28,3.36,33.61,10.09,8.32,6.72,12.48,15.91,12.48,27.55s-4,20.74-12,26.89c-8,6.14-18.72,9.22-32.16,9.22ZM230.46,133.07l-7.88-34.95c-1.15-4.99-2.66-8.77-4.52-11.33-1.85-2.56-4.31-4.29-7.39-5.18-3.07-.9-6.98-1.34-11.71-1.34h-27.84v-13.83h30.91c8.7,0,15.78.8,21.22,2.4,5.44,1.6,9.7,4.39,12.77,8.35,3.08,3.97,5.51,9.54,7.3,16.71l9.8,39.18h-22.66Z" />
              <path d="M278.82,41.53c-3.07,0-5.88-.52-8.46-1.57-2.57-1.05-4.81-2.49-6.72-4.34-1.9-1.85-3.38-4.03-4.42-6.55-1.05-2.53-1.57-5.28-1.57-8.26s.52-5.8,1.57-8.32c1.05-2.52,2.52-4.72,4.42-6.58,1.91-1.87,4.15-3.32,6.72-4.34,2.58-1.03,5.4-1.55,8.46-1.55s5.89.52,8.49,1.57c2.59,1.05,4.84,2.49,6.75,4.34,1.91,1.85,3.37,4.03,4.4,6.55,1.03,2.53,1.55,5.29,1.55,8.32s-.52,5.73-1.55,8.23c-1.03,2.5-2.49,4.69-4.4,6.56-1.9,1.87-4.16,3.32-6.75,4.37-2.6,1.05-5.43,1.57-8.49,1.57ZM278.82,38.95c2.65,0,5.07-.45,7.25-1.34,2.18-.89,4.1-2.17,5.74-3.81,1.64-1.64,2.91-3.57,3.81-5.77.9-2.2,1.34-4.61,1.34-7.22s-.44-4.98-1.34-7.2c-.89-2.22-2.17-4.16-3.81-5.8-1.64-1.64-3.56-2.92-5.74-3.84-2.18-.91-4.6-1.37-7.25-1.37s-5.03.46-7.23,1.37c-2.2.92-4.12,2.2-5.74,3.84-1.62,1.64-2.88,3.58-3.78,5.8-.9,2.23-1.34,4.62-1.34,7.2s.44,5.02,1.34,7.22c.89,2.21,2.15,4.13,3.78,5.77,1.62,1.64,3.54,2.91,5.74,3.81s4.61,1.34,7.23,1.34ZM290.02,16.59h-6.55c-.3-1.08-.84-1.94-1.62-2.55-.78-.61-1.76-.92-2.91-.92-1.68,0-2.97.68-3.86,2.04-.89,1.36-1.34,3.24-1.34,5.63s.45,4.25,1.34,5.6c.89,1.34,2.18,2.02,3.86,2.02,1.08,0,2.03-.3,2.83-.89.8-.6,1.36-1.41,1.66-2.41h6.55c-.6,2.84-1.87,4.94-3.83,6.3-1.97,1.37-4.29,2.05-6.98,2.05-3.7,0-6.61-1.13-8.74-3.39-2.13-2.26-3.19-5.36-3.19-9.27s1.05-7.03,3.16-9.33c2.11-2.29,5.01-3.44,8.71-3.44,2.69,0,5.05.72,7.09,2.16,2.03,1.44,3.31,3.57,3.83,6.41Z" />
            </svg>
          </Link>
        </div>

        <div className="menu-toggle cursor-pointer" onClick={toggleMenu}>
          <p ref={menuOpenTextRef} className={textTone}>
            Menu
          </p>
          <p ref={menuCloseTextRef} id="menu-close">
            Close
          </p>
        </div>
      </nav>

      <div className="menu-overlay">
        <div className="menu-content">
          <div className="menu-items">
            <div className="col-lg">
              <div ref={menuPreviewImgRef} className="menu-preview-img">
                <img src="/assets/images/menu/sunset.JPG" alt="" />
              </div>
            </div>

            <div className="col-sm">
              <div className="menu-links">
                {menuLinks.map((link, i) => {
                  const isActive = pathname === link.path;

                  return (
                    <div
                      key={i}
                      className={`link ${
                        isActive ? "text-gray-500" : "text-white"
                      }`}
                      onMouseOver={() => handleLinkHover(link.prevImg)}
                      onClick={(e) => handleNavClick(e, link.path)}
                    >
                      <Link href={link.path}>{link.label}</Link>
                    </div>
                  );
                })}
              </div>

              <div className="menu-socials">
                <div className="social">
                  <a href="https://instagram.com/david_righi">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
