import "./Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";
import {
  faCircleExclamation,
  faRightLong,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";

const FormData = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const counter = {
    color: "#51b869",
    fontSize: "14px",
    fontWeight: "bold",
    paddingTop: "10px",
    boxSizing: "borderBox",
  };
  const submit = {
    background: "#C04F4F",
    color: "white",
    fontSize: "16px",
    marginTop: "10px",
  };
  const expire = {
    background: "#f0f0f0",
    borderRadius: "30px",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    if (firstName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "First name is required",
      }));
      formIsValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
    }

    if (lastName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "Last name is required",
      }));
      formIsValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
    }

    if (email.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      formIsValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (formIsValid) {
      const data = {
        fname: firstName,
        lname: lastName,
        email: email,
      };

      try {
        await axios.post("http://127.0.0.1:8000/api/send-otp", data);
        toast.success("OTP sent successfully!");
        setIsOpen(true);
        startCountdown();
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP. Please try again.");
      }
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpFields = useRef([]);

  const closeModal = () => setIsOpen(false);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    if (!isNaN(value) && value !== "") {
      newOtp[index] = value;
      if (index < 5) {
        otpFields.current[index + 1]?.focus(); 
      }
    } else {
      newOtp[index] = "";
      if (index > 0) {
        otpFields.current[index - 1]?.focus();
      }
    }
    setOtp(newOtp);
  };
  

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text");
    const pastedDigits = pastedData.split("");
    const newOtp = [...otp];
    pastedDigits.forEach((digit, index) => {
      if (!isNaN(digit)) newOtp[index] = digit;
    });
    setOtp(newOtp);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
  
    const enteredOtp = otp.join("");
    console.log("OTP submitted:", enteredOtp);
  
    if (enteredOtp.length !== 6) {
      toast.error("Fill 6 Digit OTP");
      return;
    }
  
    const data = {
      otp: enteredOtp,
      email: email,
    };
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-otp",
        data
      );
  
      setOtp(["", "", "", "", "", ""]); // Resetting OTP input
      const fnameInput = document.getElementById("fname");
      const lnameInput = document.getElementById("lname");
      const emailInput = document.getElementById("email");
      const btnSub = document.getElementById("btnSub");
      const btnCreate = document.getElementById("btnCreate");
  
      if (fnameInput && lnameInput && emailInput && btnSub && btnCreate) {
        fnameInput.readOnly = true;
        lnameInput.readOnly = true;
        emailInput.readOnly = true;
        fnameInput.classList.add("is-valid");
        lnameInput.classList.add("is-valid");
        emailInput.classList.add("is-valid");
        btnSub.style.display = "none";
        btnCreate.style.display = "block";
  
        closeModal();
        swal("Good job!", "You Are Verified", "success");
      } else {
        console.error("Some elements are missing!");
      }
    } catch (error) {
      toast.error("Invalid OTP");
      console.error("Error occurred while verifying OTP:", error);
    }
  };
  

  const startCountdown = () => {
    const timer = setInterval(() => {
      if (countdown > 1) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      setShowResendButton(true);
    }, 30000);
  };

  const startCountdownBtn = () => {
    setShowResendButton(false);
    setCountdown(30);
    startCountdown();
    const data = {
      fname: firstName,
      lname: lastName,
      email: email,
    };

    try {
      axios.post("http://127.0.0.1:8000/api/send-otp", data);
      toast.success("OTP sent successfully!");
      setIsOpen(true);
      startCountdown();
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const keyUp = () => {
    if (firstName === " ") {
      setFirstName("");
    }
    if (lastName === " ") {
      setLastName("");
    }
    if (email ===" ") {
      setEmail("");
    }
  }
  

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-sm-6 main" id="mainContainer">
          <div className="row p-0">
            <div className="col-sm-7 m-0 leftCss">
              <h5 className="px-2 pt-5 TextStyleHead">
                Begin Your Advertising Journey
              </h5>
              <h3 className="px-2">With 7Search PPC</h3>
              <form
                onSubmit={handleSubmit}
                id="regForm"
                className="px-2 py-3 m-0"
              >
                <input
                  id="fname"
                  value={firstName}
                  onKeyUp={keyUp}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className={`form-control border mt-2 border-dark ${
                    errors.firstName && "is-invalid"
                  }`}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
                <input
                  id="lname"
                  value={lastName}
                  onKeyUp={keyUp}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className={`form-control border border-dark mt-3 ${
                    errors.lastName && "is-invalid"
                  }`}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
                <input
                  id="email"
                  type="email"
                  value={email}
                  onKeyUp={keyUp}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={`form-control border mt-3 border-dark ${
                    errors.email && "is-invalid"
                  }`}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}

                <button
                  type="submit"
                  id="btnSub"
                  className="form-control mt-4 text-light"
                  style={{ background: "#C04F4F" }}
                >
                  Verify Email
                </button>
                <button className="btn form-control btn-success mt-4 text-light" id="btnCreate" style={{"display":"none"}}>Account Created <FontAwesomeIcon icon={faRightLong}/></button>
              </form>
            </div>
            <div className="col-sm-5 m-0 px-4 rightCss text-light">
              <p className="text-light fs-5 fw-bold">7searchPPC.com</p>
              <p className="TextStyle">
                Industry Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised
                in the 1960s with the release ublishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="row">
            <div className="col-sm-4 mx-auto">
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                style={{ maxWidth: "400px" }}
              >
                <div className="modal-content">
                  <div className="row">
                    <div className="col-sm-10">
                      <button
                        type="button"
                        id="btn_cross"
                        className="close btn btn-danger"
                        onClick={closeModal}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                  <div className="row mx-auto mx-2">
                    <div className="col-sm-10 mx-auto">
                      <div className="row" id="img">
                        <div className="col-sm-3">
                          <img
                            src="https://7searchppc.in/register/assets/lockicon.png"
                            height="80px"
                          />
                        </div>
                        <div
                          className="col-sm-8  px-4 "
                          style={{ fontSize: "14px" }}
                        >
                         OTP sent to <b style={{"color":"white"}}>{email}</b> Kindly, check spam folder if not received.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <div
                          htmlFor="otp"
                          style={expire}
                          className="text-center m-2 "
                        >
                          {" "}
                          <FontAwesomeIcon icon={faCircleExclamation} /> This
                          Otp Will Expire In 15 Minutes
                        </div>
                        <input type="email" hidden value={email} />
                        <input type="text" hidden value={firstName} />
                        <input type="text" hidden value={lastName} />
                        <div className="row">
                          <div className="col-sm-9 mx-auto">
                            <div className="d-flex justify-content-between">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  style={{ width: "40px", height: "40px" }} // Set width and height here
                                  className="form-control otp-input m-1 border border-danger"
                                  value={digit}
                                  onChange={(e) =>
                                    handleOtpChange(index, e.target.value)
                                  }
                                  onPaste={handlePaste}
                                  ref={(ref) =>
                                    (otpFields.current[index] = ref)
                                  }
                                  maxLength="1"
                                  pattern="[0-9]*"
                                  inputMode="numeric"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn  form-control  "
                        style={submit}
                        onClick={sendOtp}
                      >
                        Verify
                      </button>
                      <div className="row">
                        <div className="col-sm-12 d-flex justify-content-end">
                          {!showResendButton ? (
                            <p style={counter}>resend OTP in {countdown}s</p>
                          ) : (
                            <button
                              type="dummy"
                              onClick={startCountdownBtn}
                              className="btn btn-sm fw-bold text-danger"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default FormData;

