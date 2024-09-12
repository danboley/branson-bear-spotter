import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <p className="text-xl">Poke the bear to head home...</p>
      <a href="/" className="mt-4">
        <img
          src="./bransonbear.png"
          className="w-full max-w-md"
          alt="Branson Bear"
        />
      </a>
    </div>
  );
};

export default NotFound;
