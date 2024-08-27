import React from "react";

const Home = ({ backendData }) => {
  return (
    <div>
      <h1>Branson Bear Spotter</h1>
      {typeof backendData === "undefined" ? (
        <p>Loading...</p>
      ) : (
        backendData.map((user, i) => <p key={i}>{user.username}</p>)
      )}
    </div>
  );
};

export default Home;
