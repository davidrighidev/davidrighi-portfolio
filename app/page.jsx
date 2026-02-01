import Link from "next/link";
import QuoteCopy from "./components/QuoteCopy";

export default function Home() {
  return (
    <>
      <section className="relative h-[60vh] sm:h-screen w-screen bg-black">
        <img
          src="/assets/images/hero/hero.webp"
          alt="Hero background"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

        <h1 className="text-white absolute bottom-0 leading-tight flex w-full justify-center text-center font-medium z-0 text-[clamp(2rem,16vw,26rem)]">
          DAVID RIGHI
        </h1>

        <div className="absolute opacity-85 text-neutral-100 w-auto h-7 md:h-9 top-46 right-[5vw] md:top-[26vh] md:right-[21vw] z-0">
          <img
            src="/assets/images/hero/yup-thats-me.png"
            alt=""
            className="rotate-5 w-full h-full"
          />
        </div>
        <div className="absolute w-auto h-7 md:h-15 top-50 right-[16vw] md:top-[30vh] md:right-[26vw] z-0">
          <img
            src="/assets/icons/scribble-arrow.svg"
            alt=""
            className="rotate-30"
          />
        </div>
      </section>

      <section className="bg-black relative sm:py-50 py-30 sm:px-30 px-6 gap-5 flex flex-col">
        <QuoteCopy>
          <p className="text-neutral-100 z-1 text-xl text-pretty md:text-5xl lg:text-[3.5rem] text-left">
            Creativity is a conversation between vision and emotion. Through
            design and photography, moments become meaning — each one shaped to
            speak, move, and resonate.
          </p>
        </QuoteCopy>
        <div className="flex justify-start sm:justify-center">
          <Link href={"/about"}>
            <div className="btn-light max-sm:text-sm">
              <span>Explore more about me</span>
            </div>
          </Link>
        </div>
        <div className="absolute opacity-20 sm:w-130 w-100 h-auto top-[50%] left-[50%] translate-[-50%] z-0">
          <img src="/assets/icons/scribble.svg" className="" alt="" />
        </div>
      </section>
    </>
  );
}
