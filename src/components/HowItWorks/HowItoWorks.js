import React, { useEffect } from "react";
import "./HowItoWorks.css";
// import metaHeroImg from "../../assets/metaHero.png";
import HowItWorks from "../../../src/assets/HowItWorks.jpg";
import { useNavigate } from "react-router-dom";
import SplitText from "../../Utilis/split3.min";
import gsap from "gsap";

const HowItoWorks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const split = new SplitText("#hero-text", {
      type: "lines",
      linesClass: "LineChildren",
    });

    const splitParent = new SplitText("#hero-text", {
      type: "lines",
      linesClass: "LineParents",
    });

    gsap.to(split.lines, {
      duration: 1.5,
      y: 0,
      opacity: 1,
      stagger: 0.1,
      ease: "power2",
    });
  }, []);

  return (
    <>
      <div className="howItWorks-content" id="howitworks" data-scroll-section>
        <div className="imgBox">
          <img src={HowItWorks} alt="aboutImg" className="metaHero" />
        </div>
        <div className="textBox">
          <h2 id="hero-text">How it Works</h2>
          <p id="hero-text">Get your MetaLoan with just 6 easy steps:</p>
          <ul className="requestLoan_list">
            <li id="hero-text">1. Fill out the Request a Loan form below.</li>
            <li id="hero-text">
              2. MetaLoan will review your inquiry and get back to you with a
              loan plan.
            </li>
            <li id="hero-text">
              3. You provide requested documentation and the down payment.
            </li>
            <li id="hero-text">
              4. MetaLoan purchases the metaverse land you’re interested in and
              gives you full use rights.
            </li>
            <li id="hero-text">
              5. You make secure payments via MetaLoan’s decentralized
              application, which provides you with accurate and verifiable
              transaction history on the blockchain.
            </li>
            <li id="hero-text">
              6. After you complete your monthly payments, MetaLoan sends the
              metaverse land to your wallet.
            </li>
          </ul>
          <div id="hero-text">
            <button className="btn" onClick={() => navigate("/requestloan")}>
              Request a Loan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItoWorks;
