import React from "react";
import { useAuth } from "./AuthContext";

const Home: React.FC = () => {
  const { token } = useAuth();
  return (
    <div className="p-4 bg-main text-text-light min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Branson Bear Tracker
      </h1>
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 text-center mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Have you seen this bear?
          </h2>
          <h3 className="text-lg font-semibold mb-4">
            Welcome to the one and only reliable resource for reporting and
            tracking Branson Bear sightings!
          </h3>
          <div className="space-x-4">
            <a href="/map">
              <button className="bg-secondary border-2 border-white hover:bg-main text-text-light my-2 px-4 py-2 rounded hover:bg-secondary-dark transition duration-300">
                Explore All Sightings
              </button>
            </a>
            {token ? (
              <a href="/submissions">
                <button className="bg-secondary border-2 border-white hover:bg-main text-text-light my-2 px-4 py-2 rounded hover:bg-secondary-dark transition duration-300">
                  Report A Sighting
                </button>
              </a>
            ) : (
              <a href="/login">
                <button className="bg-secondary border-2 border-white hover:bg-main text-text-light my-2 px-4 py-2 rounded hover:bg-main-dark transition duration-300">
                  Sign In to Report A Sighting
                </button>
              </a>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src="./bransonbear.png"
            className="w-full max-w-md"
            alt="Branson Bear"
          />
        </div>
      </div>
      <div className="text-center mt-8 px-4 max-w-8xl border-t-2 py-8">
        <p className="text-lg font-semibold mb-2">
          Looking for even more Branson Bear content?
        </p>
        <p className="mb-4">
          The "Branson Bear" brand has gone through many iterations. Branson
          Bear has been a part of many cultural touchstones that you might not
          even realize, from age-old lullabies, to cutting-edge AI experiments.
        </p>
        <div className="flex-column justify-center items-center">
          <p className="text-lg font-semibold mb-2">
            Dive deeper in into the Branson Bear universe here:{" "}
          </p>

          <button
            type="button"
            className="bg-secondary text-text-light px-4 py-2 rounded border-2 border-white hover:bg-main transition duration-300"
          >
            <a href="https://www.littlebransonbear.com" target="_blank">
              {" "}
              LittleBransonBear.com
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
