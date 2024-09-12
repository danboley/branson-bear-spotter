import React, { useState } from "react";
import { faqs } from "./types/faqs";

const About: React.FC = () => {
  const [isOpen, setIsOpen] = useState(Array(4).fill(false));

  const toggleAnswer = (index: number) => {
    setIsOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="p-4 bg-main min-h-screen flex flex-col items-center">
      <div className="max-w-screen-xl">
        <h1 className="font-bold text-center text-xl md:text-3xl text-text-light">
          Welcome to the Branson Bear Tracker
        </h1>
        <h2 className="text-lg text-center py-4 px-8 text-text-light">
          Here are some projects conceived & created by the Shredderz.
        </h2>

        <p className="text-lg text-center py-4 px-8 text-text-light">
          Confused? Us too. Peruse some of our FAQs for more info.
        </p>
        <div className="max-w-3xl mx-auto my-8 space-y-4 md:my-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-secondary"
            >
              <button
                type="button"
                id={"question" + index}
                data-state="closed"
                onClick={() => toggleAnswer(index)}
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
              >
                <span className="flex text-lg font-semibold text-black">
                  {faq.question}
                </span>
                <span>
                  <svg
                    id={"arrow" + index}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`w-6 h-6 black ${
                      isOpen[index]
                        ? "transform rotate-0"
                        : "transform rotate-180"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </span>
              </button>
              <div
                id={"answer" + index}
                style={{ display: isOpen[index] ? "block" : "none" }}
                className="px-4 pb-5 sm:px-6 sm:pb-6"
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
