import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Alert, Button, Progress, Badge } from 'reactstrap';
import { FaLightbulb, FaChartLine, FaCheckCircle, FaArrowRight, FaBed, FaClock, FaStar } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import '../css/onboarding.css';

function SleepAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await apiService.getSleepStats();
        if (response.success) {
          setAnalysis(response.data.stats);
        } else {
          setError('Failed to load sleep analysis');
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError('Failed to load sleep analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const getSleepQualityColor = (quality) => {
    if (quality >= 8) return 'success';
    if (quality >= 6) return 'warning';
    return 'danger';
  };

  const getSleepQualityText = (quality) => {
    if (quality >= 8) return 'Excellent';
    if (quality >= 6) return 'Good';
    if (quality >= 4) return 'Fair';
    return 'Poor';
  };

  const getDurationAssessment = (duration) => {
    if (duration >= 7 && duration <= 9) return { status: 'Optimal', color: 'success', icon: '✅' };
    if (duration >= 6 && duration < 7) return { status: 'Slightly Low', color: 'warning', icon: '⚠️' };
    if (duration > 9) return { status: 'Too Much', color: 'info', icon: 'ℹ️' };
    return { status: 'Insufficient', color: 'danger', icon: '❌' };
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (analysis) {
      const avgQuality = analysis.avgSleepQuality || 5;
      const avgDuration = analysis.avgSleepDuration || 7;
      
      if (avgQuality < 6) {
        recommendations.push({
          title: 'Improve Sleep Quality',
          description: 'Your sleep quality is below optimal. Consider establishing a consistent bedtime routine.',
          priority: 'high'
        });
      }
      
      if (avgDuration < 7) {
        recommendations.push({
          title: 'Increase Sleep Duration',
          description: 'Aim for 7-9 hours of sleep per night for optimal health and performance.',
          priority: 'high'
        });
      } else if (avgDuration > 9) {
        recommendations.push({
          title: 'Optimize Sleep Duration',
          description: 'You may be sleeping too much. 7-9 hours is typically optimal for adults.',
          priority: 'medium'
        });
      }
      
      if (recommendations.length === 0) {
        recommendations.push({
          title: 'Maintain Good Habits',
          description: 'Your sleep patterns look good! Keep up with your current routine.',
          priority: 'low'
        });
      }
    }
    
    return recommendations;
  };

  const handleContinueToDashboard = () => {
    window.location.href = '/dashboard';
  };

  if (!currentUser) {
    return <Navigate to="/home" />;
  }

  if (loading) {
    return (
      <div className="App" style={{ color: "white" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Analyzing your sleep patterns...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App" style={{ color: "white" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Alert color="danger">
                {error}
              </Alert>
              <Button color="primary" onClick={handleContinueToDashboard}>
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const durationAssessment = getDurationAssessment(analysis?.avgSleepDuration || 7);
  const recommendations = getRecommendations();

  return (
    <div className="App" style={{ color: "white" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="text-center mb-4">
              <h2><FaLightbulb className="me-2" />Your Sleep Analysis</h2>
              <p className="lead">Based on your sleep data, here's what we found:</p>
            </div>

            {analysis && (
              <>
                {/* Sleep Quality Card */}
                <Card className="mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <CardBody>
                    <CardTitle className="d-flex align-items-center">
                      <FaStar className="me-2" />
                      Sleep Quality Assessment
                    </CardTitle>
                    <div className="row">
                      <div className="col-md-6">
                        <h4 className={`text-${getSleepQualityColor(analysis.avgSleepQuality || 5)}`}>
                          {getSleepQualityText(analysis.avgSleepQuality || 5)}
                        </h4>
                        <p>Average Quality: {analysis.avgSleepQuality?.toFixed(1) || 'N/A'}/10</p>
                        <Progress 
                          value={((analysis.avgSleepQuality || 5) / 10) * 100} 
                          color={getSleepQualityColor(analysis.avgSleepQuality || 5)}
                          className="mb-2"
                        />
                      </div>
                      <div className="col-md-6">
                        <p><strong>Best Quality:</strong> {analysis.bestSleepQuality || 'N/A'}/10</p>
                        <p><strong>Worst Quality:</strong> {analysis.worstSleepQuality || 'N/A'}/10</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Sleep Duration Card */}
                <Card className="mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <CardBody>
                    <CardTitle className="d-flex align-items-center">
                      <FaClock className="me-2" />
                      Sleep Duration Analysis
                    </CardTitle>
                    <div className="row">
                      <div className="col-md-6">
                        <h4 className={`text-${durationAssessment.color}`}>
                          {durationAssessment.icon} {durationAssessment.status}
                        </h4>
                        <p>Average Duration: {analysis.avgSleepDuration?.toFixed(1) || 'N/A'} hours</p>
                        <p><strong>Range:</strong> {analysis.minSleepDuration?.toFixed(1) || 'N/A'} - {analysis.maxSleepDuration?.toFixed(1) || 'N/A'} hours</p>
                      </div>
                      <div className="col-md-6">
                        <div className="text-center">
                          <div className="display-4 text-primary">
                            {analysis.avgSleepDuration?.toFixed(1) || 'N/A'}
                          </div>
                          <small>hours per night</small>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Sleep Efficiency Card */}
                <Card className="mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <CardBody>
                    <CardTitle className="d-flex align-items-center">
                      <FaChartLine className="me-2" />
                      Sleep Efficiency
                    </CardTitle>
                    <div className="row">
                      <div className="col-md-6">
                        <h4 className="text-info">
                          {analysis.avgSleepEfficiency?.toFixed(1) || 'N/A'}%
                        </h4>
                        <p>Time spent sleeping vs. time in bed</p>
                        <Progress 
                          value={analysis.avgSleepEfficiency || 0} 
                          color="info"
                          className="mb-2"
                        />
                      </div>
                      <div className="col-md-6">
                        <p><strong>Total Entries:</strong> {analysis.totalEntries || 0}</p>
                        <p><strong>Tracking Period:</strong> Based on your recent data</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Recommendations */}
                <Card className="mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <CardBody>
                    <CardTitle className="d-flex align-items-center">
                      <FaCheckCircle className="me-2" />
                      Personalized Recommendations
                    </CardTitle>
                    <div className="row">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="col-12 mb-3">
                          <div className="d-flex align-items-start">
                            <Badge 
                              color={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'success'}
                              className="me-3 mt-1"
                            >
                              {rec.priority.toUpperCase()}
                            </Badge>
                            <div>
                              <h6>{rec.title}</h6>
                              <p className="mb-0">{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {/* Continue Button */}
            <div className="text-center">
              <Button 
                color="primary" 
                size="lg"
                onClick={handleContinueToDashboard}
                className="px-5 py-3"
                style={{ 
                  backgroundColor: '#007bff', 
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
                  transition: 'all 0.3s ease'
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
                <FaArrowRight className="me-2" />
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SleepAnalysis; 