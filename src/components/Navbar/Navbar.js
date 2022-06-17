import React,{useEffect, useState} from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from "../../redux/blockchain/blockchainActions";
import { useDispatch, useSelector} from "react-redux";
import {fetchData} from "../../redux/data/dataActions";
import './Navbar.css';

const Navbar = () => {

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const [click, setClick] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);


    useEffect(()=> {
        fetchAccounts();
        dispatch(fetchData(blockchain.account));
    }, [])

    // fetch accounts Data
    async function fetchAccounts () {
        const { ethereum } = window;
        const metamaskIsInstalled = ethereum && ethereum.isMetaMask;

        if(metamaskIsInstalled) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                  });
                  setAccounts(accounts[0]);               
            } catch (error) {
                console.log(error);
            }
        }
    }

    
    

    return (
       <header> 
           <Link to="/" className="logo" onClick={closeMobileMenu}> <span>MetaLoan</span></Link>
           <div className="toggle-menu" onClick={handleClick}></div>
            <ul className={click ? "navigation active" : "navigation"}>

                 <li>
                   <Link to="/" onClick={closeMobileMenu}>Home</Link> 
                </li>

                <li>
                    <Link to="/About" onClick={closeMobileMenu}>About Us</Link>     
                </li>

                <li>
                   <Link to="/howItWorks" onClick={closeMobileMenu}>How it Works</Link> 
                </li>

                <li>
                    <Link to="/ContactForm" onClick={closeMobileMenu}>Request a Loan</Link> 
                </li>

                
                {/* <li>
                    <Link to="/launchApp/submitLoan" id="connect" onClick={closeMobileMenu}>My Loan</Link>     
                </li>

                <li>
                    <button className='btn'
                            id="connect"
                            onClick={(e)=> {
                                e.preventDefault();
                                dispatch(connect());
                            }}>
                                {accounts.length === 0 ? "Connect Wallet" : (
                                <div id='address'>
                                    {accounts.substring(0, 12)}...
                                </div>)}
                            </button>
                </li> */}
            </ul>
       </header>
    )
}

export default Navbar;






