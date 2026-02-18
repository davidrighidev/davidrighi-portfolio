import React from "react";
import Copy from "../components/Copy";

export const metadata = {
  title: "About",
};

const page = () => {
  return (
    <section className="w-full py-5 bg-white">
      <div className="lg:grid grid-cols-12 gap-10 lg:px-10 px-5 mt-20 lg:mt-30 mb-10 lg:mb-30">
        <div className="col-span-5 col-start-2">
          <Copy>
            <h1 className="lg:text-6xl text-4xl font-medium lg:mb-15 mb-8">
              <em className="font-accent tracking-tight text-neutral-700 font-normal">
                A short intro,
              </em>
              <br />
              who am I?
            </h1>
          </Copy>
          <Copy delay={0.8} animateOnScroll={false}>
            <p className="text-pretty">
              I am a self-taught hobby photographer and graphic designer based
              in the heart of the Dolomites in Italy. I discovered my passion
              for graphic design a few years ago, and since then, I’ve been
              exploring the endless possibilities of creativity through digital
              art, photo editing, and visual storytelling.
            </p>
            <br />

            <p className="text-pretty">
              I have a passion for capturing those special moments that make
              life so beautiful. I really enjoy traveling to different places,
              meeting new people, and sharing their stories through my photos.
              Every trip is a rewarding experience, and that's exactly why I
              find traveling and exploring the world so beautiful.
            </p>
            <br />
            <p className="text-pretty max-sm:mb-5">
              When I’m not behind the lens, you’ll find me sailing the open
              waters or spiking a volleyball on the court. Feel free to explore
              my website and all of the moments I’ve captured through my lens –
              they’re a snapshot of my creativity!
            </p>
          </Copy>
        </div>
        <div className="col-span-4 col-start-8">
          <img src="/assets/images/me.jpg" alt="" />
        </div>
      </div>

      <div className="px-10">
        <div className="w-full h-full grid grid-cols-2 mb-10">
          <div className="h-px col-span-2 bg-neutral-200 mb-10"></div>
          <div className="uppercase text-gray-secondary">Personal Skills</div>
          <div className="flex flex-col gap-2 text-black ">
            <Copy>
              <div>Creativity</div>
              <div>Teamwork</div>
              <div>Communication</div>
              <div>Responsability</div>
            </Copy>
          </div>
        </div>

        <div className="w-full h-full grid grid-cols-2 mb-10">
          <div className="h-px col-span-2 bg-neutral-200 mb-10"></div>
          <div className="uppercase text-gray-secondary">Languages</div>
          <div className="flex flex-col gap-2 text-black ">
            <Copy>
              <div>German</div>
              <div>Italian</div>
              <div>English</div>
            </Copy>
          </div>
        </div>

        <div className="w-full h-full grid grid-cols-2 mb-10">
          <div className="h-px col-span-2 bg-neutral-200 mb-10"></div>
          <div className="uppercase text-gray-secondary">Technical Skills</div>
          <div className="flex flex-col gap-2 text-black ">
            <Copy>
              <div>Adobe Illustrator</div>
              <div>Adobe Photoshop</div>
              <div>Adobe InDesign</div>
              <div>Adobe Premiere</div>
              <div>Adobe After Effects</div>
            </Copy>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
