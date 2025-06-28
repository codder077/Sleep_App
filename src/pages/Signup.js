import React, { useState } from 'react'
import { Form, FormGroup, Input, Label, Alert } from 'reactstrap'
import { FaArrowDown, FaEye, FaEyeSlash } from 'react-icons/fa';
import "../css/loginform.css"
import { useAuth } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const { register, currentUser, error } = useAuth();

    const signup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        setGeneralError('');
        
        const { email, password, username } = e.target.elements;
        const result = await register(username.value, email.value, password.value);
        
        if (!result.success) {
            // Handle structured error response from backend
            if (result.error && typeof result.error === 'object' && result.error.errors) {
                const errors = {};
                result.error.errors.forEach(err => {
                    // Map backend field names to form field names
                    let fieldName = err.field;
                    if (fieldName === 'displayName') {
                        fieldName = 'username';
                    }
                    errors[fieldName] = err.message;
                });
                setFieldErrors(errors);
                setGeneralError(result.error.message || 'Registration failed. Please check the errors below.');
            } else {
                // Handle simple error string
                setGeneralError(result.error || 'Registration failed. Please try again.');
            }
            setLoading(false);
        }
    };

    const getFieldError = (fieldName) => {
        return fieldErrors[fieldName] || '';
    };

    const isFieldInvalid = (fieldName) => {
        return !!fieldErrors[fieldName];
    };

    if (currentUser) {
        return <Navigate to="/onboarding" />;
    }

    return (
        <div className='App'>
            <Link className='logButton' to="/home" ><img src="./wysa.png" className="App-logo" alt="logo" /></Link>
            <br></br>
            <h4 style={{color:"white"}}>Hey! I'm <span style={{color:"#2aaacd"}}>Wysa</span></h4>
            <p style={{color:"white", margin:"0px"}}>Our conversations are private &</p>
            <p style={{color:"white", margin:"0px"}}>anonymous, Just choose a nickname and signup and</p>
            <p style={{color:"white", margin:"0px"}}>we're good to go.</p>
            <br></br>
            <h3 style={{color: "white"}}>Signup</h3>
            <br></br>
            
            {generalError && (
                <Alert color="danger" style={{ margin: '0 20px 20px 20px' }}>
                    {generalError}
                </Alert>
            )}
            
            <div className="container">
                <div className='row align-items-center'>
                    <div className="col align-self-center">
                        <Form className='form-login' onSubmit={signup}>
                            <FormGroup floating className='input-container'>
                                <Input 
                                    id="username" 
                                    name="username" 
                                    placeholder="username" 
                                    type="text" 
                                    style={{
                                        borderRadius: "50px",
                                        borderColor: isFieldInvalid('username') ? '#dc3545' : undefined
                                    }}
                                    required
                                    disabled={loading}
                                    invalid={isFieldInvalid('username')}
                                />
                                <Label for="username">
                                    Choose a Nickname...
                                </Label>
                                {getFieldError('username') && (
                                    <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '5px' }}>
                                        {getFieldError('username')}
                                    </div>
                                )}
                            </FormGroup>
                            {' '}
                            <FormGroup floating className='input-container'>
                                <Input 
                                    id="email" 
                                    name="email" 
                                    placeholder="Email" 
                                    type="email" 
                                    style={{
                                        borderRadius: "50px",
                                        borderColor: isFieldInvalid('email') ? '#dc3545' : undefined
                                    }}
                                    required
                                    disabled={loading}
                                    invalid={isFieldInvalid('email')}
                                />
                                <Label for="email">
                                    Email
                                </Label>
                                {getFieldError('email') && (
                                    <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '5px' }}>
                                        {getFieldError('email')}
                                    </div>
                                )}
                            </FormGroup>
                            {' '}
                            <FormGroup floating className='input-container'>
                                <div style={{ position: 'relative' }}>
                                    <Input 
                                        id="password" 
                                        name="password" 
                                        placeholder="Password" 
                                        type={showPassword ? "text" : "password"}
                                        style={{
                                            borderRadius: "50px",
                                            borderColor: isFieldInvalid('password') ? '#dc3545' : undefined,
                                            paddingRight: '50px'
                                        }}
                                        required
                                        disabled={loading}
                                        invalid={isFieldInvalid('password')}
                                    />
                                    <button
                                        type="button"
                                        style={{
                                            position: 'absolute',
                                            right: '15px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#6c757d',
                                            cursor: 'pointer',
                                            zIndex: 10
                                        }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <Label for="password">
                                    Password
                                </Label>
                                {getFieldError('password') && (
                                    <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '5px' }}>
                                        {getFieldError('password')}
                                    </div>
                                )}
                            </FormGroup>
                            {' '}
                            
                            <div className='submit-container'>
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <FaArrowDown className="arrow-icon" />
                                    )}
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
            <br></br>
            <p style={{fontSize:"0.7rem", color:"white", margin:"0px"}}>By continuing, I confirm I am 13 or older and accept the</p>
            <p style={{fontSize:"0.7rem", color:"white", margin:"0px"}}><Link to='/'>Terms of Service</Link> and <Link to='/'>Privacy Policy</Link></p>
        </div>
    )
}

export default Signup
