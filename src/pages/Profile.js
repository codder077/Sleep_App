import React, { useState } from 'react';
import { Form, FormGroup, Input, Label, Button, Alert, Card, CardBody, CardTitle } from 'reactstrap';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import "../css/loginform.css";

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    phoneCode: currentUser?.phoneCode || '',
    phoneNumber: currentUser?.phoneNumber || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    country: currentUser?.country || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <Navigate to="/home" />;
  }

  return (
    <div className='App'>
      <Link className='logButton' to="/dashboard">
        <img src="./wysa.png" className="App-logo" alt="logo" />
      </Link>
      <br></br>
      <h4 style={{color:"white"}}>Hey! I'm <span style={{color:"#2aaacd"}}>Wysa</span></h4>
      <h3 style={{color: "white"}}>Profile Settings</h3>
      <br></br>

      {error && (
        <Alert color="danger" style={{ margin: '0 20px 20px 20px' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert color="success" style={{ margin: '0 20px 20px 20px' }}>
          {success}
        </Alert>
      )}

      <div className="container">
        <div className='row align-items-center'>
          <div className="col align-self-center">
            <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }}>
              <CardBody>
                <CardTitle tag="h5" style={{ color: 'white' }}>Update Your Profile</CardTitle>
                <Form onSubmit={handleSubmit}>
                  <FormGroup floating className='input-container'>
                    <Input 
                      id="displayName" 
                      name="displayName" 
                      placeholder="Display Name" 
                      type="text" 
                      style={{borderRadius: "50px"}}
                      value={formData.displayName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    <Label for="displayName">
                      Display Name
                    </Label>
                  </FormGroup>

                  <FormGroup floating className='input-container'>
                    <Input 
                      id="phoneCode" 
                      name="phoneCode" 
                      placeholder="Phone Code" 
                      type="text" 
                      style={{borderRadius: "50px"}}
                      value={formData.phoneCode}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <Label for="phoneCode">
                      Phone Code (e.g., +1)
                    </Label>
                  </FormGroup>

                  <FormGroup floating className='input-container'>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      placeholder="Phone Number" 
                      type="tel" 
                      style={{borderRadius: "50px"}}
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <Label for="phoneNumber">
                      Phone Number
                    </Label>
                  </FormGroup>

                  <FormGroup floating className='input-container'>
                    <Input 
                      id="city" 
                      name="city" 
                      placeholder="City" 
                      type="text" 
                      style={{borderRadius: "50px"}}
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <Label for="city">
                      City
                    </Label>
                  </FormGroup>

                  <FormGroup floating className='input-container'>
                    <Input 
                      id="state" 
                      name="state" 
                      placeholder="State" 
                      type="text" 
                      style={{borderRadius: "50px"}}
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <Label for="state">
                      State/Province
                    </Label>
                  </FormGroup>

                  <FormGroup floating className='input-container'>
                    <Input 
                      id="country" 
                      name="country" 
                      placeholder="Country" 
                      type="text" 
                      style={{borderRadius: "50px"}}
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <Label for="country">
                      Country
                    </Label>
                  </FormGroup>

                  <div className='submit-container'>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={loading}
                      style={{
                        borderRadius: '25px',
                        padding: '12px 40px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        backgroundColor: '#007bff',
                        border: 'none',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 20px rgba(0,123,255,0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(0,123,255,0.3)';
                        }
                      }}
                    >
                      {loading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link 
          to="/dashboard" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            border: '2px solid white',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#333';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'white';
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Profile; 