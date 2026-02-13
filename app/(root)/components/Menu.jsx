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
        <div className="logo">
          <Link href="/">
            <span
              className={`text-[1rem] sm:text-[1.5rem] font-medium ${textTone}`}
            >
              DR
            </span>
            <span className={`text-[0.5rem] sm:text-[0.75rem] ${textTone}`}>
              ©
            </span>
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
