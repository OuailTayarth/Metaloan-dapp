import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "../src/styles/globalStyles";
import moment from "moment";
import Web3 from "web3";
import LaunchApp from "./components/LaunchApp/LaunchApp";
import SubmitLoan from "./components/UserPages/SubmitLoan/SubmitLoan";
import PayLoan from "./components/UserPages/PayLoan/PayLoan";
import FetchLoan from "./components/UserPages/FetchLoan/FetchLoan";
import FetchBorrowers from "./components/UserPages/FetchBorrowers/FetchBorrowers";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import ContactForm from "./components/ContactForm/ContactForm";
import Admin from "./components/Admin/Admin";
import HowItoWorks from "./components/HowItWorks/HowItoWorks";
import ERC20ABI from "./ERC20ABI.json";
import FAQ from "./components/FAQ/FAQ";
import OurTeam from "./components/OurTeam/OurTeam";
import Loader from "./components/Loader/Loader";
import Home from "./components/Home";
let web3 = new Web3(window.ethereum);

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [loanId, setLoanId] = useState(0);

  const [LoanData, setLoanData] = useState([]);
  const [BorrowersData, setBorrowersData] = useState([]);
  const [alert, setAlert] = useState({ show: false, msg: "" });
  const [activePayment, setActivePayment] = useState(false);
  const [isBorrowerAddress, setBorrowerAddress] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);

  // useEffect(()=> {
  //   navigate("/", {replace: true});
  // },[]);

  // ShowAlert
  function showAlert(show = false, msg = "") {
    setAlert({ show: show, msg: msg });
  }

  // keep the user connected on page refresh
  useEffect(() => {
    const onPageConnected = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          dispatch(connect());
        } catch (err) {
          console.log(err);
        }
      }
    };
    onPageConnected();
  }, []);

  // Increment Loan Id
  function incrementLoanId() {
    let newLoanId = loanId + 1;
    if (newLoanId > 100) {
      newLoanId = 100;
    }
    setLoanId(newLoanId);
  }

  // Decrement Loan Id
  function decrementLoanId() {
    let newLoanId = loanId + 1;
    if (newLoanId > 0) {
      newLoanId = 0;
    }
    setLoanId(newLoanId);
  }

  // Function to request a loan for a specific loan plan
  async function getLoan() {
    showAlert(true, "Welcome to MetaLoan, your payment is processing...!");
    setActivePayment(true);

    /* Get Plan Information */
    let plan = await blockchain.smartContract.methods.idToPlan(loanId).call();
    let tokenPayment = plan.tokenPayment;
    let upfrontPayment = plan.upfrontPayment;

    /* Create Instance of USDC || USDT smart contracts to approve metaloan contracts.*/
    let stableTokenContract = new web3.eth.Contract(ERC20ABI, tokenPayment);

    const MetaLoanAddress = "0xA3b2C7cE6f2788148EBfc65BeB4Cb04cb3BDe46E";

    /** 
      * We can't use to param: because we are approving not transferring funds.
      * NOTE: In order to transfer funds from a user wallet to another wallet throught a third party contract(Metaloan contract)
        the USER MUST APPROVE the third party contract to spend his tokens and his behalf.
      * The approve function should come firt and should be implemented in the daap not in the smart contract.
     */
    stableTokenContract.methods
      .approve(MetaLoanAddress, upfrontPayment)
      .send({
        from: blockchain.account,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      })
      .once("error", (err) => {
        let error = err.toString();
        console.log(error);
        console.log(err);
        setActivePayment(false);
        showAlert(true, "Something went wrong...!");
      })
      .then((receipt) => {
        blockchain.smartContract.methods
          .requestLoan(loanId)
          .send({
            from: blockchain.account,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
          })
          .once("error", (err) => {
            let error = err.toString();
            console.log(error);
            setActivePayment(false);
            showAlert(true, "Something went wrong...!");
          })
          .then((receipt) => {
            console.log(receipt);
            setActivePayment(false);
            showAlert(
              true,
              "Congratulations, your loan has been submitted successfully!"
            );
            dispatch(fetchData(blockchain.account));
          });
      });
  }

  /* Function to make a monthly payment */
  async function payLoan() {
    setActivePayment(true);
    showAlert(true, "Happy to see you, your payment is processing...!");

    /* Get Plan Information */
    let plan = await blockchain.smartContract.methods.idToPlan(loanId).call();
    console.log(plan);
    let tokenPayment = plan.tokenPayment;
    let monthlyPayment = plan.monthlyPayment;

    /* Create Instance of USDC tokens */
    let stableTokenContract = new web3.eth.Contract(ERC20ABI, tokenPayment);

    const MetaLoanAddress = "0xA3b2C7cE6f2788148EBfc65BeB4Cb04cb3BDe46E";

    stableTokenContract.methods
      .approve(MetaLoanAddress, monthlyPayment)
      .send({
        from: blockchain.account,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      })
      .once("error", (err) => {
        console.log(err);
        setActivePayment(false);
        showAlert(true, "Something went wrong...!");
      })
      .then((receipt) => {
        blockchain.smartContract.methods
          .payLoan(loanId)
          .send({
            from: blockchain.account,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
          })
          .once("error", (error) => {
            console.log(error);
            setActivePayment(false);
            showAlert(true, "Something went wrong...!");
          })
          .then((receipt) => {
            console.log(receipt);
            setActivePayment(false);
            showAlert(
              true,
              "Congratulations, your monthly payment has been submitted successfully!"
            );
            dispatch(fetchData(blockchain.account));
          });
      });
  }

  /* Function that fetch a single user loan*/
  async function fetchLoanData() {
    /* User Account */
    const userAccount = await blockchain.account;

    /* Get Loan information */
    const data = await blockchain.smartContract.methods
      .fetchMyLoan(userAccount, loanId)
      .call();

    /* Get the total Payment of each wallet */
    const paymentData = await blockchain.smartContract.methods
      .totalPaymentPerWallet(userAccount)
      .call();
    const totalPaymentPerWallet = paymentData / 1000000;

    /* Loan information */

    // const status = (data.activated).toString();
    let startDay = moment.unix(data.start).toString();
    let nextPayment = moment.unix(data.nextPayment).toString();
    let borrowerAddress = data.borrower.toString();

    setBorrowerAddress(borrowerAddress.toLowerCase());

    // {status == true ? "Active" : ""}

    let item = {
      borrower: borrowerAddress,
      startLoan: startDay,
      nextPayment: nextPayment,
      totalPayment: totalPaymentPerWallet,
      activated: "Active",
    };

    setLoanData(item);
  }

  // fetch borrowers Data
  async function fetchBorrowersData() {
    /* Get all borrowers */
    const data = await blockchain.smartContract.methods
      .fetchAllBorrowers()
      .call();

    /* Fetch all borrowers */
    let items = await Promise.all(
      data.map(async (el) => {
        /* All borrowers information */
        // const status = (el.activated).toString();
        let startDay = moment.unix(el.start).toString();
        let nextPayment = moment.unix(el.nextPayment).toString();
        let borrowerAddress = el.borrower.toString();

        let item = {
          borrower: borrowerAddress,
          start: startDay,
          nextPayment: nextPayment,
          activated: "Active",
        };

        return item;
      })
    );
    setBorrowersData(items);
  }

  return (
    <s.Main>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/howitWorks" element={<HowItoWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/metateam" element={<OurTeam />} />
            <Route
              path="/requestloan"
              element={<ContactForm removeAlert={showAlert} alert={alert} />}
            />

            {/* <Route path="/faq" element={<FAQ/>}/> */}
            <Route
              path="/admin"
              element={
                <Admin
                  showAlert={showAlert}
                  alert={alert}
                  activePayment={activePayment}
                  setActivePayment={setActivePayment}
                />
              }
            />
            <Route
              path="/launchApp"
              element={
                <LaunchApp
                  fetchLoanData={fetchLoanData}
                  fetchBorrowersData={fetchBorrowersData}
                />
              }
            >
              <Route
                path="submitLoan"
                element={
                  <SubmitLoan
                    getLoan={getLoan}
                    incrementLoanId={incrementLoanId}
                    decrementLoanId={decrementLoanId}
                    loanId={loanId}
                    alert={alert}
                    removeAlert={showAlert}
                    activePayment={activePayment}
                  />
                }
              />

              <Route
                path="payLoan"
                element={
                  <PayLoan
                    payLoan={payLoan}
                    alert={alert}
                    removeAlert={showAlert}
                    incrementLoanId={incrementLoanId}
                    decrementLoanId={decrementLoanId}
                    loanId={loanId}
                    activePayment={activePayment}
                  />
                }
              />

              <Route
                path="fetchLoan"
                element={
                  <FetchLoan
                    LoanData={LoanData}
                    isBorrowerAddress={isBorrowerAddress}
                  />
                }
              />

              <Route
                path="borrowers"
                element={<FetchBorrowers BorrowersData={BorrowersData} />}
              />

              {/* <Route path="createPlan"
                  element={<CreatePlan createPlan={createPlan}/>}/> */}
            </Route>
          </Routes>
          {/* <ContactForm removeAlert={showAlert}
                       alert={alert}/> */}
          <Footer />
        </>
      )}
    </s.Main>
  );
}
export default App;
