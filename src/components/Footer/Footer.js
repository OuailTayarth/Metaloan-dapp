import React from 'react'
import { FaTwitter } from 'react-icons/fa';
import { AiOutlineInstagram} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
       <div className="Footer">
           <div className="container">
               <div className="row">
                {/* <img src={logo} className="logo" alt="loopStudio logo" /> */}
                <div></div>

                <ul className="navigation">
                    <li>
                        <Link to="/">MetaLoan</Link>
                    </li>
                </ul>
               </div>

               <div className="row">
                <ul className="social-media">
                    {/* <li>
                        <Link to="/" className="icon"> <FaFacebook/> </Link>
                    </li> */}

                    <li>
                        <a href="https://twitter.com/meta_loan?s=11&t=o0Jez5odsPGMSJg7SgLfFQ" 
                        className="icon"
                        target="_blank"
                        rel="noreferrer"> <FaTwitter/> </a>
                    </li>

                    <li>
                        <a  
                        href="https://www.instagram.com/metaloan_/?igshid=YmMyMTA2M2Y=" 
                        className="icon" 
                        target="_blank" 
                        rel="noreferrer"> <AiOutlineInstagram/> </a>
                    </li>
                </ul>
                
                    <div className="message-legal">
                        <p>©MetaLoan.All Right Reserved 2022</p>
                    </div>
               </div>
           </div>
       </div>
    )
}

export default Footer;