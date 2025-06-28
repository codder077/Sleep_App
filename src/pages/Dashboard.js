import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, CardText, Row, Col, Alert, Spinner, Collapse } from 'reactstrap';
import { FaChevronDown, FaChevronUp, FaPlus, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import apiService from '../services/api';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [sleepData, setSleepData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecentEntriesOpen, setIsRecentEntriesOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sleepResponse, statsResponse] = await Promise.all([
          apiService.getSleepData({ limit: 5 }),
          apiService.getSleepStats()
        ]);

        if (sleepResponse.success) {
          setSleepData(sleepResponse.data.sleepData);
        }

        if (statsResponse.success) {
          setStats(statsResponse.data.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return <Navigate to="/home" />;
  }

  if (loading) {
    return (
      <div className='App' style={{color: "white"}}>
        <div className='container text-center'>
          <Spinner color="light" />
          <p>Loading your sleep data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='App' style={{color: "white"}}>
      <div className='container'>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link className='logButton' to="/home">
            <img src="./wysa.png" className="App-logo" alt="logo" />
          </Link>
          <Button 
            color="outline-light" 
            onClick={handleLogout}
            style={{
              borderRadius: '20px',
              padding: '8px 20px',
              border: '2px solid white',
              transition: 'all 0.3s ease'
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
            <FaSignOutAlt className="me-2" />
            Sign out
          </Button>
        </div>

        <h4 style={{color:"white"}}>Hey! I'm <span style={{color:"#2aaacd"}}>Wysa</span></h4>
        <h2>Welcome back, {currentUser.displayName}!</h2>
        
        {error && (
          <Alert color="danger">
            {error}
          </Alert>
        )}

        {/* Sleep Statistics */}
        {stats && (
          <Row className="mb-4">
            <Col md={12}>
              <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }}>
                <CardBody>
                  <CardTitle tag="h5">Your Sleep Overview</CardTitle>
                  <Row>
                    <Col md={3}>
                      <CardText>
                        <strong>Total Entries:</strong> {stats.totalEntries || 0}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        <strong>Avg Sleep Duration:</strong> {stats.avgSleepDuration ? `${stats.avgSleepDuration.toFixed(1)}h` : 'N/A'}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        <strong>Avg Sleep Quality:</strong> {stats.avgSleepQuality ? `${stats.avgSleepQuality.toFixed(1)}/10` : 'N/A'}
                      </CardText>
                    </Col>
                    <Col md={3}>
                      <CardText>
                        <strong>Best Sleep Quality:</strong> {stats.bestSleepQuality || 'N/A'}/10
                      </CardText>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Recent Sleep Data - Collapsible */}
        <Row>
          <Col md={12}>
            <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }}>
              <CardBody>
                <div 
                  className="d-flex justify-content-between align-items-center cursor-pointer"
                  onClick={() => setIsRecentEntriesOpen(!isRecentEntriesOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  <CardTitle tag="h5" className="mb-0">Recent Sleep Entries</CardTitle>
                  {isRecentEntriesOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                
                <Collapse isOpen={isRecentEntriesOpen}>
                  {sleepData.length > 0 ? (
                    sleepData.map((entry, index) => (
                      <div key={entry.id || index} className="mb-3 p-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <Row>
                          <Col md={3}>
                            <strong>Date:</strong> {new Date(entry.createdAt).toLocaleDateString()}
                          </Col>
                          <Col md={3}>
                            <strong>Bed Time:</strong> {entry.bedTime}
                          </Col>
                          <Col md={3}>
                            <strong>Wake Time:</strong> {entry.wakeTime}
                          </Col>
                          <Col md={3}>
                            <strong>Duration:</strong> {entry.sleepDuration}h
                          </Col>
                        </Row>
                        {entry.sleepQuality && (
                          <Row className="mt-2">
                            <Col md={6}>
                              <strong>Sleep Quality:</strong> {entry.sleepQuality}/10
                            </Col>
                            <Col md={6}>
                              <strong>Quality:</strong> {entry.qualityDescription}
                            </Col>
                          </Row>
                        )}
                        {entry.change && entry.change.length > 0 && (
                          <div className="mt-2">
                            <strong>Goals:</strong>
                            <ul className="mb-0">
                              {entry.change.map((goal, i) => (
                                <li key={i}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <CardText>No sleep data yet. Complete the onboarding to get started!</CardText>
                  )}
                </Collapse>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons - Improved Styling */}
        <Row className="mt-4">
          <Col md={6} className="mb-3">
            <Link to="/onboarding" style={{ textDecoration: 'none' }}>
              <Button 
                color="primary" 
                size="lg" 
                block
                style={{
                  borderRadius: '25px',
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,123,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,123,255,0.3)';
                }}
              >
                <FaPlus className="me-2" />
                Add New Sleep Entry
              </Button>
            </Link>
          </Col>
          <Col md={6} className="mb-3">
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <Button 
                color="secondary" 
                size="lg" 
                block 
                outline
                style={{
                  borderRadius: '25px',
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: '2px solid #6c757d',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.borderColor = '#6c757d';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#6c757d';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaUserEdit className="me-2" />
                Update Profile
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Dashboard;
