"use client";

import Copy from "@/app/(root)/components/Copy";
import { Download, FolderDown, Link } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import data from "./data.json";

export default function Page() {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const thumbnail = data.thumbnail; // dynamisches Thumbnail

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-screen h-screen">
        <Image
          src={thumbnail}
          alt={data.title}
          fill
          className="absolute object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 justify-center text-center">
          <Copy fade={true}>
            <h1 className="text-[clamp(16px,4.5vw,100px)] text-white font-medium uppercase tracking-wide">
              {data.title}
            </h1>
          </Copy>
          <Copy delay={0.3} fade={true}>
            <h5 className="text-neutral-200 text-[clamp(11px,1.2vw,30px)] uppercase font-light tracking-wider">
              {data.subtitle}
            </h5>
          </Copy>
        </div>

        <div className="absolute bottom-5 w-full text-center">
          <p className="text-neutral-200 font-extralight text-[clamp(9px,1vw,28px)] italic">
            &copy; David Righi
          </p>
        </div>
      </section>

      {/* Inner Nav Icons */}
      <div className="w-full flex justify-end gap-4 p-5">
        {/* Copy Link */}
        <button
          onClick={copyUrl}
          className="flex items-center gap-1 text-neutral-500 transition-colors cursor-pointer hover:text-black"
        >
          <Link size={20} />
          {copied ? "Copied!" : "Copy URL"}
        </button>

        {/* Download ZIP */}
        <a
          href="/downloads/dorfturnier.zip"
          className="flex items-center gap-1 text-neutral-500 transition-colors hover:text-black"
        >
          <FolderDown size={20} />
          Download All
        </a>
      </div>

      {/* Masonry Gallery */}
      <section className="w-screen bg-white lg:px-5 px-2 pb-10">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-2">
          {data.images.map((img, i) => (
            <div
              key={i}
              className="mb-2 break-inside-avoid relative group cursor-pointer"
            >
              <Image
                src={img.src}
                width={img.width}
                height={img.height}
                alt=""
                className="w-full h-auto"
              />

              {/* Hover Download Overlay nur auf lg */}
              {data.downloadable && (
                <a
                  href={img.src}
                  download
                  className="absolute inset-0 pr-3 pt-3 flex h-12.5 bg-linear-to-b from-black/20 to-transparent items-start justify-end opacity-0 lg:group-hover:opacity-100 transition"
                >
                  <div className="">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
