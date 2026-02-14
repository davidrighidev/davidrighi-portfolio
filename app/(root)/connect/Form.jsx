import React from "react";

const Form = () => {
  return (
    <form className="w-full bg-neutral-100 p-7">
      <div className="mt-7">
        <input
          type="text"
          name="name"
          required
          className="text-xl py-2 w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-400 outline-none"
          placeholder="Your Name"
        />
      </div>
      <div className="mt-7">
        <input
          type="email"
          name="email"
          required
          className="text-xl py-2 w-full bg-transparent border-b-2 border-gray-200 focus:border-gray-400 outline-none"
          placeholder="Your Email"
        />
      </div>
      <div className="mt-7">
        <textarea
          placeholder="Your Message"
          name="message"
          required
          className="text-xl py-2 w-full h-32 bg-transparent border-b-2 border-gray-200 focus:border-gray-400 outline-none resize-none"
        ></textarea>
      </div>
      <button className="text-xl btn mt-7" type="submit">
        <span>SEND MESSAGE</span>
      </button>
    </form>
  );
};

export default Form;
