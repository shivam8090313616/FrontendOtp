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
  faLeftLong,
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
  const [submitBtn, setSubmit] = useState("Verify Email");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const closeModal = () => {
    setIsOpen(false);
    setOtp(["", "", "", "", "", ""]);
  };
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

  const meter = {
    background: "#c98282",
    position: "relative",
    top: "-36px",
    zIndex: "0",
    height: "8px",
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
      try {

        document.querySelector("#btnSub").style.display = "none";
        document.querySelector("#loader").style.display = "block";
        document.querySelector("#btnPro").style.display = "block";
  
        const data = {
          fname: firstName,
          lname: lastName,
          email: email,
        };
  
        const response = await axios.post("http://localhost:8000/api/send-otp", data);
        toast.success("OTP sent successfully!");
        setIsOpen(true);
        startCountdown();
        setErrors((prevErrors) => ({ ...prevErrors, email: "", firstName: "", lastName: "" }));
        document.querySelector("#loader").style.display = "none";
        document.querySelector("#btnSub").style.display = "block";
        document.querySelector("#btnPro").style.display = "none";
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const { errors } = error.response.data;
  
          if (errors.fname) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              firstName: errors.fname[0],
            }));
          }
          if (errors.lname) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              lastName: errors.lname[0],
            }));
          }
          if (errors.email) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: errors.email[0],
            }));
          }
        } else {
          console.log("Error sending OTP:", error);
        }
  
        document.querySelector("#loader").style.display = "none";
        document.querySelector("#btnSub").style.display = "block";
        document.querySelector("#btnPro").style.display = "none";
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

      const emailInput = document.getElementById("email");
      const btnSub = document.getElementById("btnSub");
      const btnCreate = document.getElementById("btnCreate");
      const verified = document.querySelector(".verified");
      verified.style.display = "block";
      emailInput.readOnly = true;
      btnSub.style.display = "none";
      btnCreate.style.display = "block";
      btnCreate.style.background = "green";
      setIsOpen(false);
      toast.success("Good job!", "You Are Verified", "success");
    } catch (error) {
      console.log(error.response.data.status);
      document.querySelector("#otpError").innerHTML=error.response.data.status;
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
      axios.post("http://localhost:8000/api/send-otp", data);
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
    const point2 = document.querySelector(".point2");
    const point1 = document.querySelector(".point1");
    const point3 = document.querySelector(".point3");
    const step2 = document.querySelector(".step2");
    tab1.style.display = "none";
    tab2.style.display = "block";
    tab3.style.display = "none";
    step2.classList.add("active-step");
    point2.style.color = "green";
    point3.style.color = "red";
    point1.style.color = "red";
  };

  const nextTab3 = (e) => {
    e.preventDefault();
    if (mobile.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "mobile are required",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: "" }));
    }

    if (messenger.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "messenger id are required",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, messenger: "" }));
    }

    const tab1 = document.querySelector(".tab1");
    const tab2 = document.querySelector(".tab2");
    const tab3 = document.querySelector(".tab3");
    const point3 = document.querySelector(".point3");
    const point1 = document.querySelector(".point1");
    const point2 = document.querySelector(".point2");
    const step3 = document.querySelector(".step3");
    tab1.style.display = "none";
    tab2.style.display = "none";
    tab3.style.display = "block";
    step3.classList.add("active-step");
    point3.style.color = "green";
    point1.style.color = "red";
    point2.style.color = "red";
  };

  const prevTab1 = (e) => {
    e.preventDefault();
    if (mobile.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "mobile are required",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile: "" }));
    }

    if (messenger.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "messenger id are required",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, messenger: "" }));
    }
    const tab1 = document.querySelector(".tab1");
    const tab2 = document.querySelector(".tab2");
    const tab3 = document.querySelector(".tab3");
    const point3 = document.querySelector(".point3");
    const point1 = document.querySelector(".point1");
    const point2 = document.querySelector(".point2");
    point1.style.color = "green";
    point3.style.color = "red";
    point2.style.color = "red";
    tab1.style.display = "block";
    tab2.style.display = "none";
    tab3.style.display = "none";
  };

  const prevTab2 = (e) => {
    e.preventDefault();
    if (password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "password are required",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    if (confirmpassword.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmpassword: "Confirm - Password id are required",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, confirmpassword: "" }));
    }
    const tab1 = document.querySelector(".tab1");
    const tab2 = document.querySelector(".tab2");
    const tab3 = document.querySelector(".tab3");
    const point3 = document.querySelector(".point3");
    const point1 = document.querySelector(".point1");
    const point2 = document.querySelector(".point2");
    point3.style.color = "red";
    point1.style.color = "red";
    point2.style.color = "green";
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
        firstName: "First name is required",
      }));
    } else if (firstName.length > 20) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "First name must be 20 characters allowed",
      }));
    } else if (!/^[A-Za-z\s]*$/.test(firstName)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "Only alphabetic characters allowed",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "",
      }));
    }
  };

  const handleChangeFirstName = (e) => {
    let value = e.target.value.slice(0, 21);
    setFirstName(value.trimStart());
  };

  const keyUp2 = () => {
    if (lastName.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "Last name is required",
      }));
    } else if (lastName.length > 20) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "Last name must be 20 characters allowed",
      }));
    } else if (!/^[A-Za-z\s]*$/.test(lastName)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "Only alphabetic characters allowed",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "",
      }));
    }
  };

  const handleChangeLastName = (e) => {
    let value = e.target.value.slice(0, 21);
    setLastName(value.trimStart());
  };

  const handleChangeEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const keyUp4 = () => {
    if (mobile.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "Contact info is required",
      }));
    } else if (mobile.length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "Must be 10 digit allowed",
      }));
    } else if (!/^[0-9\s]*$/.test(mobile)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "Only Numbers  allowed",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: "",
      }));
    }
  };

  const handleChangeMobile = (e) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    setMobile(value);
  };

  const keyUp5 = () => {
    if (messenger.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "Messenger is required",
      }));
    } else if (messenger.length > 15) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "Must be 15 characters allowed",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        messenger: "",
      }));
    }
  };

  const handleChangeMessenger = (e) => {
    let value = e.target.value;
    setMessenger(value.trimStart());
  };

  const handleChangePassword = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    setPassword(value.slice(0, 8));
  };

  const keyUp6 = () => {
    if (password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
    } else if (password.length < 6 || password.length > 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be 6-8 characters long",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
      }));
    }
  };

  const handleChangeConfirmPassword = (e) => {
    let value = e.target.value.replace(/\s/g, ""); // Remove spaces from input
    setConfirmPassword(value.slice(0, 8)); // Limit to a maximum of 8 characters
  };

  const keyUp7 = () => {
    if (confirmpassword.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmpassword: "Confirm Password is required",
      }));
    } else if (confirmpassword !== password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmpassword: "Passwords do not match",
      }));
      const createAnAccount = document.querySelector("#createAnAccount");
      createAnAccount.style.background = "#C04F4F";
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmpassword: "",
      }));
      const createAnAccount = document.querySelector("#createAnAccount");
      createAnAccount.style.background = "green";
    }
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
                <div className="step-item active-step">Verify</div>
                <div className="step-item step2">General Info</div>
                <div className="step-item step3">Password</div>
              </div>
              <div className="step-indicator mt-0">
                <div className="point1">
                  <FontAwesomeIcon icon={faCircle} className="point1" />
                </div>
                <div className="point2 ">
                  <FontAwesomeIcon icon={faCircle} className="point2 " />
                </div>
                <div className="point3">
                  <FontAwesomeIcon icon={faCircle} className="point3" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-8 mx-auto">
                  <meter
                    className="form-control p-0 m-0"
                    height={"2px"}
                    style={meter}
                    id="disk_d"
                    value=".2"
                  ></meter>
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
                  <div className="input-group mt-1">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleChangeEmail}
                      placeholder="Email address"
                      className={`form-control border mt-3 border-dark ${
                        errors.email && "is-invalid"
                      }`}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                    <div
                      className="input-group-append  mt-3 verified"
                      style={{
                        display: "none",
                        border: "1px solid green",
                        background: "#bee8be",
                      }}
                    >
                      <span
                        className="input-group-text text-success py-2 fw-bold"
                        style={{ fontSize: "14px", background: "#bee8be" }}
                        id="verified"
                      >
                        <FontAwesomeIcon icon={faCheck} className="me-2 " />{" "}
                        Verified
                      </span>
                    </div>
                  </div>

                  <input
                    id="btnSub"
                    type="submit"
                    onClick={handleSubmit}
                    className="form-control mt-4 mb-4 text-light"
                    style={{ background: "#C04F4F" }}
                    value={submitBtn}
                  />

                  <div id="btnPro" style={{ display: "none" }}>
                    <button
                      id="loadButton"
                      class="btn btn-success form-control d-flex justify-content-center mt-3"
                      disabled
                    >
                      processing
                      <span class="loader" id="loader"></span>
                    </button>
                  </div>

                  <div className="row ">
                    <div className="col-sm-12 d-flex justify-content-end">
                      <button
                        id="btnCreate"
                        onClick={nextTab2}
                        className="btn   mt-4 text-light"
                        style={{ display: "none", background: "#C04F4F" }}
                      >
                        <FontAwesomeIcon icon={faRightLong} />
                      </button>
                    </div>
                  </div>
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

                  <div className="row">
                    <div className="col-sm-12 d-flex justify-content-between">
                      <button
                        style={{ background: "#C04F4F", color: "white" }}
                        onClick={prevTab1}
                        className="btn mt-4 ms-2"
                      >
                        <FontAwesomeIcon icon={faLeftLong} />
                      </button>
                      <button
                        style={{ background: "#C04F4F" }}
                        onClick={nextTab3}
                        className="btn   mt-4 me-2 text-light"
                      >
                        <FontAwesomeIcon icon={faRightLong} />
                      </button>
                    </div>
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
                    id="createAnAccount"
                    style={{ background: "#C04F4F", color: "white" }}
                    className="btn form-control mt-4 text-light"
                  >
                    Create An Account
                  </button>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      onClick={prevTab2}
                      className="btn "
                      style={{ background: "#C04F4F", color: "white" }}
                    >
                      <FontAwesomeIcon icon={faLeftLong} />
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
                      <div className="row">
                              <div className="col-sm-12 text-center">
                              <span id="otpError" className="text-center text-danger" style={{"fontSize":"12px"}}></span>
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
