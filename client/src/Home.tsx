import React from "react";
import { Poi } from "./types/types";

interface HomeProps {
  pois: Poi[];
}

const Home: React.FC<HomeProps> = ({ pois }) => {
  return (
    <div>
      <h1>Branson Bear Spotter</h1>
      <h2>Home Page</h2>
      <h3>Displaying backend info (currently pois):</h3>
      {typeof pois === "undefined" ? (
        <p>Loading...</p>
      ) : (
        pois.map((poi, i) => <p key={i}>{poi.name}</p>)
      )}
    </div>
  );
};

export default Home;
