"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();

      // Format Rome time
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const formattedTime = formatter.format(date);

      // Calculate GMT offset for Rome
      const utcDate = new Date(
        date.toLocaleString("en-US", { timeZone: "UTC" }),
      );
      const romeDate = new Date(
        date.toLocaleString("en-US", { timeZone: "Europe/Rome" }),
      );

      const offsetHours = (romeDate - utcDate) / 36e5;
      const gmtOffset = `GMT${offsetHours >= 0 ? "+" : ""}${offsetHours}`;

      setTime(`${formattedTime} ${gmtOffset}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-white z-10 sm:px-10 px-5 h-65 flex flex-col justify-center gap-8 w-screen">
      <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-center">
        <div className="font-medium md:text-5xl text-3xl flex-1">
          <p>© 2025 David Righi</p>
          <p>All rights reserved.</p>
        </div>
        <div className="">
          <Link href={"/connect"}>
            <div className="w-50 bg-black py-3 rounded-full sm:hover:bg-neutral-800 text-white text-center">
              CONTACT &#8599;
            </div>
          </Link>
        </div>
      </div>
      <div className="h-px bg-neutral-200"></div>
      <div className="flex justify-between mx-2 font-mono text-sm  text-neutral-500">
        <div className="sm:block hidden">ITALY &rarr; Earth</div>
        <div className="hover:underline uppercase">
          <Link href={"/terms"}>TERMS</Link>
        </div>
        <div className="hover:underline uppercase">
          <Link href={"/privacy"}>PRIVACY</Link>
        </div>
        <div className="hover:underline uppercase">
          <Link href={"/cookies"}>COOKIES</Link>
        </div>
        <div className="uppercase sm:block hidden">{time}</div>
      </div>
    </footer>
  );
};

export default Footer;
