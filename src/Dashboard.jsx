import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/dashboard");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid ">
      {userData ? (
        <div className="card">
          <div
            className="card-header text-center fs-4"
            style={{ background: "#e2aeae" }}
          >
            <span className="fw-bold text-danger">7search PPC</span>
            <button onClick={handleLogout} className="btn btn-danger float-end">
              <FontAwesomeIcon icon={faPowerOff} />
            </button>
          </div>
          <div className="card-body" style={{ height: "700px" }}>
            <div className="row pt-5">
              <div className="col-sm-5 mx-auto border border-2 p-3  rounded" style={{"background":"#f7dede"}}>
                <div className="row">
                 
                  <div className="">
                    <div className="card">
                      <div className="card-header text-center bg-secondary text-light">
                        <h5 className="card-title">User Information</h5>
                      </div>
                    </div>
                    <div className="card-body border border-1 border-secondary rounded-bottom">
                      <p>
                        <strong className="text-danger">Name: </strong>{userData.fname} {userData.lname}
                      </p>
                      <p>
                        <strong className="text-danger">Email: </strong> {userData.email}
                      </p>
                      <p>
                        <strong className="text-danger">Mobile: </strong> {userData.mobile}
                      </p>
                      <p>
                        <strong className="text-danger">Messenger: </strong> {userData.messenger}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center mt-4">Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
