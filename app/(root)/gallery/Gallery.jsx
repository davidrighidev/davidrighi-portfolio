"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { visualDiary } from "../../constants/Images";

const Gallery = () => {
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
      if (w > 1920) return 5;
      if (w > 1366) return 4;
      if (w > 1024) return 3;
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
    visualDiary.forEach((src, index) => {
      cols[index % columnsCount].push({ src, index });
    });
    return cols;
  }, [columnsCount]);

  if (!isClient) return null;

  return (
    <section className="w-full py-5 bg-white">
      <div className="flex gap-2">
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

                {/* Horizontal Number Overlay */}
                {/* <div className="absolute inset-0 flex items-end justify-start p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-light tracking-wider bg-black/40 px-2 py-1 backdrop-blur-sm">
                    {String(img.index + 1).padStart(2, "0")}
                  </span>
                </div> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
