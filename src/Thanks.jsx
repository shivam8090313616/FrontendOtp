import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Thanks() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(9);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        clearInterval(timer);
        navigate("/dashboard");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="container-fluid vh-100" style={{ background: "#f2d7d7"}}>
      <div className="row">
        <div className="col-sm-12">
          <div className="mt-5">
            <p
              className="text-center"
              style={{ fontSize: "90px", color: "#c04f4f" }}
            >
              Thank You!
            </p>
            <div className="row">
              <div className="col-sm-8 mx-auto">
              <div className="row">
                <div className="col-sm-6">
                <p className="Text-dander">Thank you for Registering</p>
                <p>Your interest is greatly appreciated,</p>
                <p>and we eagerly anticipate the opportunity</p>
                <p> to provide you with our exceptional service.</p>
                
                <button className="btn text-light btn-lg fs-4 mt-5 mb-1" style={{"background":"#00BF9C"}} disabled>
                Your account will be ready shortly. {countdown}s
                </button>
                <p className="text-danger"></p>
                </div>
                <div className="col-sm-6">
                  <img className="w-75" src="https://crm.profaj.com/assets/img/complete.png" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
