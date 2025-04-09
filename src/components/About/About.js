import React, {useEffect} from "react";
import "./About.css";
import AboutImg from "../../../src/assets/AboutUs.jpg";
import { useNavigate } from "react-router-dom";
import SplitText from "../../Utilis/split3.min";
import gsap from 'gsap';


const About = () => {
    const navigate = useNavigate();

    useEffect(()=> {
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
            stagger:0.1,
            ease:"power2",
        })
    },[])
    return (
        <div className="about-content" id="about" data-scroll-section>
            <div className="imgBox">
                <img src={AboutImg} alt="aboutImg" className='metaHero'/>
            </div>

            <div className="textBox">
                <h2 id="hero-text">About Us</h2>
                <p id="hero-text">As the only lending company focused only on metaverse properties, MetaLoan is committed to making metaverse ownership accessible to everyone. We do this by utilizing a custom developed decentralized application that processes and services your loan on the blockchain. By using smart contract code, MetaLoan can handle metaverse loans at scale with efficiency that can’t be matched. These efficiencies making lending on metaverse land possible, and we pass those benefits on to you.</p>
                <div id="hero-text">
                    <button className='btn'
                    onClick={()=> navigate("launchApp/submitLoan")}>Request A Loan</button>
                </div>
            </div>
        </div>
)
}


export default About;