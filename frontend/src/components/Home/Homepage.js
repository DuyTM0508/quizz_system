import React from "react";
import Videos from "../../assests/video.mp4";
import { useSelector } from "react-redux";
const Homepage = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const account = useSelector((state) => state.user.account);

  console.log("<<<<<<<< check authenticated>>>>", isAuthenticated);
  console.log("<<<<<<<< check account info>>>>", account);
  return (
    <div className="homepage-container">
      <div className="homepage-video">
        <video width="750" height="500" autoPlay muted loop>
          <source src={Videos} type="video/mp4" />
        </video>
      </div>
      <div className="homepage-content">
        <div className="title1">
          Get to know your customers with forms worth filling out
        </div>
        <div className="title2">
          Collect all the data you need to understand customers with forms
          designed to be refreshingly different.
        </div>
        <div className="title3">
          <button>Get Started-it's free</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
