"use client";

import {
  ArrowDownToLine as DownloadIcon,
  FolderDown,
  Link,
  ChevronLeft,
  ChevronRight,
  Minimize,
  ArrowUp,
} from "lucide-react";

import Image from "next/image";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";

import Copy from "../(root)/components/Copy";

export default function CollectionsComponent({ data }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  // Copy URL
  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  //
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prepare slides
  const slides = useMemo(
    () =>
      data.images.map((img) => ({
        src: img.src,
        title: img.name || img.src.split("/").pop(),
        download: img.src,
        share: img.src,
      })),
    [data.images],
  );

  // Masonry grid sorting left→right
  const [sortedImages, setSortedImages] = useState(slides);

  // Responsive column count
  const getColumns = () => {
    if (typeof window === "undefined") return 2;
    const w = window.innerWidth;
    if (w > 1920) return 5; // max 5 columns
    if (w > 1366) return 4;
    if (w > 1024) return 3;
    return 2;
  };

  const sortEveryNth = (arr, n) => {
    const columns = Array.from({ length: n }, () => []);
    arr.forEach((img, idx) => columns[idx % n].push(img));
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      columns.forEach((col) => {
        if (col[i]) result.push(col[i]);
      });
    }
    return result;
  };

  useEffect(() => {
    const handleResize = () =>
      setSortedImages(sortEveryNth(slides, getColumns()));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slides]);

  // Preload next/previous images
  const preloadImage = (src) => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
  };

  useEffect(() => {
    if (!open) return;
    const currentIndex = index;
    preloadImage(slides[(currentIndex + 1) % slides.length]?.src);
    preloadImage(
      slides[(currentIndex - 1 + slides.length) % slides.length]?.src,
    );
  }, [index, open, slides]);

  return (
    <>
      {/* HERO */}
      <section className="relative w-screen h-screen">
        <Image
          src={data.thumbnail}
          alt={data.title}
          fill
          className="absolute object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 text-center">
          <Copy fade>
            <h1 className="text-[clamp(16px,4.5vw,100px)] text-white font-medium uppercase tracking-wide">
              {data.title}
            </h1>
          </Copy>
          <Copy delay={0.3} fade>
            <h5 className="text-neutral-200 text-[clamp(11px,1.2vw,30px)] uppercase font-light tracking-wider">
              {data.subtitle}
            </h5>
          </Copy>
        </div>
        <div className="absolute bottom-5 w-full text-center">
          <p className="text-neutral-200 font-extralight text-[clamp(9px,1vw,28px)] italic">
            &copy; {data.author || "David Righi"}
          </p>
        </div>
      </section>

      {/* INNER NAV */}
      <div ref={scrollRef} className="w-full flex justify-end gap-4 p-5">
        <button
          onClick={copyUrl}
          className="flex items-center cursor-pointer gap-1 text-neutral-500 hover:text-black transition"
        >
          <Link size={20} />
          {copied ? "Copied!" : "Copy URL"}
        </button>

        {data.downloadable && (
          <a
            href={data.downloadAll}
            className="flex items-center cursor-pointer gap-1 text-neutral-500 hover:text-black transition"
          >
            <FolderDown size={20} />
            Download All
          </a>
        )}
      </div>

      {/* MASONRY GRID */}
      <section className="w-screen bg-white lg:px-5 px-2 pb-10">
        {isClient && (
          <div className="flex gap-2">
            {(() => {
              const columnsCount = getColumns();
              const columns = Array.from({ length: columnsCount }, () => []);
              sortedImages.forEach((img, idx) => {
                columns[idx % columnsCount].push(img);
              });

              return columns.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-2 flex-1">
                  {column.map((img, i) => (
                    <div
                      key={i}
                      className="relative group"
                      onClick={() => {
                        setIndex(slides.indexOf(img));
                        setOpen(true);
                      }}
                    >
                      <div className="masonry-content">
                        <Image
                          src={img.src}
                          alt=""
                          width={1000}
                          height={1000}
                          className="w-full h-auto cursor-pointer"
                        />
                        {data.downloadable && (
                          <div className="absolute inset-0 pr-3 pt-3 h-15 flex bg-linear-to-b from-black/25 to-transparent items-start justify-end opacity-0 lg:group-hover:opacity-100 transition">
                            <a
                              href={img.src}
                              download
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DownloadIcon className="w-5.5 h-5.5 text-neutral-100 hover:text-neutral-200 transition-colors" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
        )}

        {/* SCROLL TO TOP */}
        <div className="justify-center w-full flex">
          <div
            onClick={() => {
              scrollRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="w-40 cursor-pointer hover:bg-neutral-100 bg-white transition-colors flex flex-col justify-center rounded-full items-center mt-20 border py-2"
          >
            <ArrowUp />
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Download]}
        animation={{ swipe: 0, fade: 0 }}
        on={{
          view: ({ index }) => setIndex(index),
        }}
        styles={{
          container: { backgroundColor: "white" },
          button: { filter: "none" },
        }}
        render={{
          iconClose: () => (
            <Minimize
              strokeWidth={1.2}
              className="w-7 h-7 mr-5 text-neutral-500 hover:text-neutral-900 transition-colors"
            />
          ),
          iconPrev: () => (
            <ChevronLeft
              strokeWidth={1}
              className="w-10 h-10 text-neutral-700 hover:text-neutral-900 transition-colors"
            />
          ),
          iconNext: () => (
            <ChevronRight
              strokeWidth={1}
              className="w-10 h-10 text-neutral-700 hover:text-neutral-900 transition-colors"
            />
          ),
          iconDownload: () => (
            <DownloadIcon
              strokeWidth={1}
              className="w-6 h-6 text-neutral-500 hover:text-neutral-900 transition-colors"
            />
          ),
          slide: ({ slide }) => (
            <div className="relative w-full h-screen flex items-center justify-center">
              <div className="relative inline-block my-10">
                <img
                  src={slide.src}
                  alt=""
                  className="max-h-[82vh] w-auto object-contain select-none"
                  draggable={false}
                />
                <div
                  onClick={() =>
                    document.querySelector(".yarl__navigation_prev")?.click()
                  }
                  className="absolute left-0 top-0 h-full cursor-pointer"
                  style={{
                    width: "calc((100vw - 100%) / 2)",
                    transform: "translateX(-100%)",
                  }}
                />
                <div
                  onClick={() =>
                    document.querySelector(".yarl__navigation_next")?.click()
                  }
                  className="absolute right-0 top-0 h-full cursor-pointer"
                  style={{
                    width: "calc((100vw - 100%) / 2)",
                    transform: "translateX(100%)",
                  }}
                />
              </div>
              <div className="absolute bottom-6 left-0 w-full text-center">
                <p className="text-sm font-light tracking-wide text-neutral-600">
                  {slide.title}
                </p>
              </div>
            </div>
          ),
        }}
      />
    </>
  );
}
