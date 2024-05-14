import "./Form.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";
import {
  faCheck,
  faCircle,
  faCircleExclamation,
  faRightLong,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { faDiagramSuccessor } from "@fortawesome/free-solid-svg-icons/faDiagramSuccessor";

const FormData = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [messenger, setMessenger] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const closeModal = () => { setIsOpen(false); setOtp(["", "", "", "", "", ""]);}
  const otpFields = useRef([]);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    messenger: "",
    password: "",
    confirmpassword: "",
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
        await axios.post("http://localhost:8000/api/send-otp", data); // Replace with your actual API endpoint
        toast.success("OTP sent successfully!");
        setIsOpen(true);
        startCountdown();
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP. Please try again.");
      }
    }
  };

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

    if (enteredOtp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    const data = {
      otp: enteredOtp,
      email: email,
    };

    try {
      await axios.post("http://localhost:8000/api/verify-otp", data); // Replace with your actual API endpoint

      setOtp(["", "", "", "", "", ""]);
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
        setIsOpen(false);
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
    setCountdown(30);
    startCountdown();
    const data = {
      fname: firstName,
      lname: lastName,
      email: email,
    };

    try {
      axios.post("http://localhost:8000/api/send-otp", data); // Replace with your actual API endpoint
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const nextTab2 = (e) => {
    e.preventDefault();
    const tab1 = document.querySelector(".tab1");
    const tab2 = document.querySelector(".tab2");
    const tab3 = document.querySelector(".tab3");
    const step2 = document.querySelector(".step2");
    tab1.style.display = "none";
    tab2.style.display = "block";
    tab3.style.display = "none";
    step2.classList.add("active-step");
  };
  const nextTab3 = (e) => {
    e.preventDefault();
    let formIsValid = true;
    if (mobile.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "mobile are required",
      }));
      formIsValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: "" }));
    }

    if (messenger.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "messenger id are required",
      }));
      formIsValid = false;
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, messenger: "" }));
    }

    const tab1 = document.querySelector(".tab1");
    const tab2 = document.querySelector(".tab2");
    const tab3 = document.querySelector(".tab3");
    const step3 = document.querySelector(".step3");
    tab1.style.display = "none";
    tab2.style.display = "none";
    tab3.style.display = "block";
    step3.classList.add("active-step");
  
  };

  const prevTab1 = (e) => {
    e.preventDefault();
    let formIsValid = true;
    if (mobile.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "mobile are required",
      }));
      formIsValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: "" }));
    }

    if (messenger.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "messenger id are required",
      }));
      formIsValid = false;
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, messenger: "" }));
    }
    const tab1 = document.querySelector(".tab1");
    const tab2 = document.querySelector(".tab2");
    const tab3 = document.querySelector(".tab3");
    tab1.style.display = "block";
    tab2.style.display = "none";
    tab3.style.display = "none";
  };

  const prevTab2 = (e) => {
    e.preventDefault();
    let formIsValid = true;
    if (password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "password are required",
      }));
      formIsValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    if (confirmpassword.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmpassword: "Confirm - Password id are required",
      }));
      formIsValid = false;
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, confirmpassword: "" }));
    }
    const tab1 = document.querySelector(".tab1");
    const tab2 = document.querySelector(".tab2");
    const tab3 = document.querySelector(".tab3");
    tab1.style.display = "none";
    tab2.style.display = "block";
    tab3.style.display = "none";
  };

  const submitData = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
      formIsValid = false;
    }

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
      formIsValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
      formIsValid = false;
    }

    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required";
      formIsValid = false;
    }

    if (!messenger.trim()) {
      errors.messenger = "Messenger is required";
      formIsValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      formIsValid = false;
    }

    if (!confirmpassword.trim()) {
      errors.confirmpassword = "Confirm password is required";
      formIsValid = false;
    } else if (confirmpassword !== password) {
      errors.confirmpassword = "Passwords do not match";
      formIsValid = false;
    }

    setErrors(errors);

    if (formIsValid) {
      const formData = {
        email: email,
        fname: firstName,
        lname: lastName,
        mobile: mobile,
        messenger: messenger,
        password: password,
        confirmpassword: confirmpassword,
      };

      try {
        await axios.post("http://localhost:8000/api/dataSubmit", formData);
        toast.success("Account Created Successfully");
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to register. Please try again.");
      }
    }
  };


  const keyUp1 = () => {
    if (firstName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "",
        
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
    }
  };

  const handleChangeFirstName = (e) => {
    const value = e.target.value.trimStart(); // Trim leading and trailing spaces
    setFirstName(value);
  };
  
     

  const keyUp2=()=>{
    if (lastName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "",
        
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
    }
  };

  const handleChangeLastName = (e) => {
    const value = e.target.value.trimStart(); // Trim leading and trailing spaces
    setLastName(value);
  };

  const keyUp3=()=>{
    if (email.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
        
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const handleChangeEmail = (e) => {
    const value = e.target.value.trimStart(); // Trim leading and trailing spaces
    setEmail(value);
  };

  const keyUp4=()=>{
    if (mobile.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "",
        
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: "" }));
    }
  };

  const handleChangeMobile = (e) => {
    const value = e.target.value.trimStart(); // Trim leading and trailing spaces
    setMobile(value);
  };

  const keyUp5=()=>{
    if (messenger.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "",
        
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, messenger: "" }));
    }
  };

  const handleChangeMessenger = (e) => {
    const value = e.target.value.trimStart(); // Trim leading and trailing spaces
    setMessenger(value);
  };

  const keyUp6=()=>{
    if (password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
        
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const handleChangePassword = (e) => {
    const value = e.target.value.trimStart(); // Trim leading and trailing spaces
    setPassword(value);
  };

  const keyUp7=()=>{
    if (confirmpassword.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmpassword: "",
        
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, confirmpassword: "" }));
    }
  };

  const handleChangeConfirmPassword = (e) => {
    const value = e.target.value.trimStart(); // Trim leading and trailing spaces
    setConfirmPassword(value);
  };


  

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-sm-7 bg-light main" id="mainContainer">
          <div className="row p-0">
            <div className="col-sm-7 m-0 leftCss">
              <h5 className="px-2 pt-4 TextStyleHead">
                Begin Your Advertising Journey
              </h5>
              <h3 className="px-2">7Search PPC</h3>
              <div className="step-indicator mb-0">
                <div className="step-item active-step">Step 1</div>
                <div className="step-item step2 ">Step 2</div>
                <div className="step-item step3">Step 3</div>
              </div>
              <div className="step-indicator mt-0">
                <div className="step-item active-step">
                  <FontAwesomeIcon icon={faCircle} />
                </div>
                <div className="step-item step2 ">
                  <FontAwesomeIcon icon={faCircle} />
                </div>
                <div className="step-item step3">
                  <FontAwesomeIcon icon={faCircle} />
                </div>
              </div>
              <form className="px-2 py-1 pt-0 m-0">
                <div className="tab1">
                  <input
                    id="fname"
                    value={firstName}
                    onKeyUp={keyUp1}
                    onChange={handleChangeFirstName}
                    placeholder="First name"
                    className={`form-control  border mt-2 border-dark ${
                      errors.firstName && "is-invalid"
                    }`}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                  <input
                    id="lname"
                    value={lastName}
                    onKeyUp={keyUp2}
                    onChange={handleChangeLastName}
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
                    onKeyUp={keyUp3}
                    onChange={handleChangeEmail}
                    placeholder="Email address"
                    className={`form-control border mt-3 border-dark ${
                      errors.email && "is-invalid"
                    }`}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}

                  <button
                    id="btnSub"
                    type="submit"
                    onClick={handleSubmit}
                    className="form-control mt-4 text-light"
                    style={{ background: "#C04F4F" }}
                  >
                    Verify Email
                  </button>
                  <button
                    id="btnCreate"
                    onClick={nextTab2}
                    className="btn form-control btn-success mt-4 text-light"
                    style={{ display: "none" }}
                  >
                    Account Created <FontAwesomeIcon icon={faRightLong} />
                  </button>
                </div>
                  


                {/* Second Form */}
                <div className="tab2" style={{ display: "none" }}>
                  <input
                    id="mobile"
                    value={mobile}
                    onKeyUp={keyUp4}
                    onChange={handleChangeMobile}
                    placeholder="Enter contact no.."
                    className={`form-control border mt-2 border-dark ${
                      errors.mobile && "is-invalid"
                    }`}
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback">{errors.mobile}</div>
                  )}
                  <input
                    id="messenger"
                    value={messenger}
                    onKeyUp={keyUp5}
                    onChange={handleChangeMessenger}
                    placeholder="Enter Messenger"
                    className={`form-control border border-dark mt-3 ${
                      errors.messenger && "is-invalid"
                    }`}
                  />
                  {errors.messenger && (
                    <div className="invalid-feedback">{errors.messenger}</div>
                  )}
                  <button
                  style={{ background: "#C04F4F" }}
                    onClick={nextTab3}
                    className="btn form-control  mt-4 text-light"
                  >
                    Continue{" "}
                    <FontAwesomeIcon icon={faRightLong} />
                  </button>

                  <div className="d-flex justify-content-start mt-3">
                    <button style={{ background: "#C04F4F", color:"white"}} onClick={prevTab1} className="btn ">
                      prev
                    </button>
                  </div>
                </div>




                    {/* third Form */}
                <div className="tab3" style={{ display: "none" }}>
                  <input
                    id="password"
                    value={password}
                    onKeyUp={keyUp6}
                    onChange={handleChangePassword}
                    placeholder="Enter password"
                    className={`form-control border mt-2 border-dark ${
                      errors.password && "is-invalid"
                    }`}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                  <input
                    id="confirmpassword"
                    value={confirmpassword}
                    onKeyUp={keyUp7}
                    onChange={handleChangeConfirmPassword}
                    placeholder="Last name"
                    className={`form-control border border-dark mt-3 ${
                      errors.confirmpassword && "is-invalid"
                    }`}
                  />
                  {errors.confirmpassword && (
                    <div className="invalid-feedback">
                      {errors.confirmpassword}
                    </div>
                  )}
                  <button
                    onClick={submitData}
                    style={{ background: "#C04F4F", color:"white"}}
                    className="btn form-control mt-4 text-light"
                  >
                    Account Created{" "}
                    <FontAwesomeIcon icon={faCheck} />
                  </button>

                  <div className="d-flex justify-content-between mt-3">
                    <button onClick={prevTab2} className="btn " style={{ background: "#C04F4F", color:"white"}}>
                      prev
                    </button>
                  </div>
                </div>
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
                in the 1960s with the release of Letraset sheets containing
                Lorem Ipsum passages, and more recently with desktop publishing
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
                            alt="lock"
                          />
                        </div>
                        <div
                          className="col-sm-8  px-4 "
                          style={{ fontSize: "14px" }}
                        >
                          OTP sent to <b style={{ color: "white" }}>{email}</b>{" "}
                          Kindly, check spam folder if not received.
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
                          <FontAwesomeIcon icon={faCircleExclamation} /> This
                          Otp Will Expire In 15 Minutes
                        </div>
                        <div className="row">
                          <div className="col-sm-9 mx-auto">
                            <div className="d-flex justify-content-between">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  style={{ width: "40px", height: "40px" }}
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
                            <p style={counter}>Resend OTP in {countdown}s</p>
                          ) : (
                            <button
                              type="button"
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
