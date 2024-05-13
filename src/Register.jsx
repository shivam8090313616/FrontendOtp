import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import css for react-toastify
import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const sendEmail = async (event) => {
        event.preventDefault();
        if (email === '') {
            toast.error("Email is required");
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/send-otp', { email });
            console.log('Response:', response.data);
            toast.success(response.data.message);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        }
    };

    const form = {
        "boxShadow": "0px 0px 10px 0px",
        "borderRadius": "10px",
        "marginTop":"39%"
    };

    const [isOpen, setIsOpen] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpFields = useRef([]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleOtpChange = (index, value) => {
      if (!isNaN(value) && value !== '') {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (index < 5) otpFields.current[index + 1].focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('Text');
      const pastedDigits = pastedData.split('').slice(0, 6);
      const newOtp = [...otp];
      pastedDigits.forEach((digit, index) => {
        if (!isNaN(digit)) newOtp[index] = digit;
      });
      setOtp(newOtp);
    };

    const img={
      "background":"#ffdbdb",
      "borderRadius":"20px",
      "padding":"4px",
      "color":"#631717"
    };

    const submit={
          "background":"#631717",
          "color":"white",
          "fontSize":"20px",
          "fontWeight":"700",
          "marginTop":"10px"
    };

    const expire={
      "background":"#f0f0f0",
      "borderRadius":"30px",
    };

    const sendOtp = async (e) => {
      e.preventDefault();
      const enteredOtp = otp.join('');
      console.log('OTP submitted:', enteredOtp);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/verify-otp', { otp: enteredOtp });
        console.log('Response:', response.data);
        setOtp(['', '', '', '', '', '']);
        closeModal();
        toast.success("Your Email Now Eligible");
      } catch (error) {
        toast.error("Invalid Otp",error);
        console.error('Error occurred while verifying OTP:', error);
      }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Form className='border border-1 border-danger p-5 ' style={form} onSubmit={sendEmail}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" className='border border-danger' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Button variant="danger" onClick={openModal} className="form-control" type="submit">
                            Send OTP
                        </Button>
                    </Form>
                    {error && <p className="text-danger">{error}</p>}
                </Col>
            </Row>
            {isOpen && (
                <div className="modal" tabIndex="-1" role="dialog" style={{display: 'block'}}>
                    <div className='row'>
                        <div className='col-sm-4 mx-auto'>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className='row'>
                                        <div className='col-sm-12'>
                                            <button type="button" id="btn_cross" className="close btn btn-danger" onClick={closeModal}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='row' style={img}>
                                        <div className='col-sm-3' >
                                            <img src='https://7searchppc.in/register/assets/lockicon.png' height="100px"/>
                                        </div>
                                        <div className='col-sm-9  py-2 fs-5' >
                                            sent to your OTP, Please Kindly check spam folder if not received
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={sendOtp}>
                                            <div className="form-group">
                                                <div htmlFor="otp" style={expire} className='text-center  p-1 m-2 '> <FontAwesomeIcon icon={faCircleExclamation}  /> This Otp Will Expire In 15 Minutes</div>
                                                <div className="d-flex justify-content-between">
                                                    {otp.map((digit, index) => (
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            className="form-control otp-input m-2 border border-danger"
                                                            value={digit}
                                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                                            onPaste={handlePaste}
                                                            ref={(ref) => otpFields.current[index] = ref}
                                                            maxLength="1"
                                                            pattern="[0-9]*"
                                                            inputMode="numeric"
                                                            required
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <button type="submit" className="btn form-control" style={submit}>Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add the ToastContainer */}
            <ToastContainer />

        </Container>
    );
}

export default Register;