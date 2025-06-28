import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button, Form, FormGroup, Input, InputGroup, Alert } from "reactstrap";
import "../css/onboarding.css";
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);
  const [sleepDataSubmitted, setSleepDataSub] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  const [sleepData, setSleepData] = useState({
    username: currentUser?.displayName || "",
    change: [],
    sleepStruggle: {
      min: 0,
      max: 2,
    },
    bedTime: "",
    wakeTime: "",
    sleepDuration: 0,
    sleepQuality: 5,
    sleepEfficiency: 0,
    notes: "",
    tags: []
  });

  const handleCheckboxChange = (checkbox) => {
    const updatedChange = sleepData.change.includes(checkbox)
      ? sleepData.change.filter((item) => item !== checkbox)
      : [...sleepData.change, checkbox];

    setSleepData({
      ...sleepData,
      change: updatedChange,
    });
  };

  const handleStruggleChange = (value) => {
    let min, max;
    switch (value) {
      case "0-2":
        min = 0;
        max = 2;
        break;
      case "2-8":
        min = 2;
        max = 8;
        break;
      case "8-10":
        min = 8;
        max = 10;
        break;
      default:
        min = 0;
        max = 2;
    }
    setSleepData({
      ...sleepData,
      sleepStruggle: {
        min,
        max,
      },
    });
  };

  const handleTimeChange = (e) => {
    setSleepData({
      ...sleepData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.createSleepData(sleepData);
      if (response.success) {
        console.log("Sleep data submitted successfully");
        setCurrentPage(currentPage + 1);
        setSleepDataSub(true);
      } else {
        setError(response.message || "Failed to submit sleep data");
      }
    } catch (error) {
      console.error("Error submitting sleep data:", error);
      setError(error.message || "Failed to submit sleep data");
    } finally {
      setLoading(false);
    }
  };

  const closeAssessment = () => {
    setSleepDataSub(true);
  };

  const handlenextArrowClick = () => {
    setCurrentPage(currentPage + 1);
  };
  
  const handleprevArrowClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleDurationChange = (e) => {
    setSleepData({
      ...sleepData,
      sleepDuration: parseFloat(e.target.value),
    });
  };

  if (!currentUser) {
    return <Navigate to="/home" />;
  }

  if (sleepDataSubmitted) {
    return <Navigate to="/sleep-analysis" />;
  }

  return (
    <div className="App" style={{ color: "white" }}>
      <div className="container">
        <div className="row align-items-center">
          {currentPage !== 0 && (
            <div className="col-12 col-md-2">
              <div className="submit-container">
                <button
                  className="submit-button"
                  onClick={handleprevArrowClick}
                  disabled={loading}
                >
                  <FaArrowLeft className="arrow-icon" />
                </button>
              </div>
            </div>
          )}
          {currentPage === 0 && (
            <div className="col-12 col-md-2"></div>
          )}
          <div className="col-12 col-md-8">
            {error && (
              <Alert color="danger" style={{ marginBottom: '20px' }}>
                {error}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              {currentPage === 0 && (
                <>
                  <h3>
                    Let's start by calculating your sleep efficiency and examining
                    your concerns
                    <br />
                    Over time, we will work together to improve these
                  </h3>
                  <div className="submit-container mt-4">
                    <button
                      type="button"
                      className="submit-button"
                      onClick={handlenextArrowClick}
                      disabled={loading}
                    >
                      <FaArrowRight className="arrow-icon" />
                    </button>
                  </div>
                </>
              )}
              {currentPage === 1 && (
                <>
                  <h3>
                    Let's say in a few weeks, you're sleeping well. What would
                    change?{" "}
                  </h3>
                  <div>Select all the changes you would like</div>
                  <br />
                  <br />
                  <FormGroup>
                    <Button
                      className="changeButton"
                      color={
                        sleepData.change.includes("I would go to sleep easily")
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() =>
                        handleCheckboxChange("I would go to sleep easily")
                      }
                      disabled={loading}
                    >
                      I would go to sleep easily
                    </Button>
                    <Button
                      className="changeButton"
                      color={
                        sleepData.change.includes(
                          "I would sleep throughout the night"
                        )
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() =>
                        handleCheckboxChange(
                          "I would sleep throughout the night"
                        )
                      }
                      disabled={loading}
                    >
                      I would sleep throughout the night
                    </Button>
                    <Button
                      className="changeButton"
                      color={
                        sleepData.change.includes("I would wake up on time, refreshed")
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() =>
                        handleCheckboxChange("I would wake up on time, refreshed")
                      }
                      disabled={loading}
                    >
                      I would wake up on time, refreshed
                    </Button>
                    <Button
                      className="changeButton"
                      color={
                        sleepData.change.includes("I would sleep for the length of time that I plan to")
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() =>
                        handleCheckboxChange("I would sleep for the length of time that I plan to")
                      }
                      disabled={loading}
                    >
                      I would sleep for the length of time that I plan to
                    </Button>
                  </FormGroup>
                </>
              )}
              {currentPage === 2 && (
                <>
                  <h3>How many hours do you struggle with sleep each night?</h3>
                  <div>This includes time it takes to fall asleep and time spent awake during the night</div>
                  <br />
                  <br />
                  <FormGroup>
                    <Button
                      className="changeButton"
                      color={
                        sleepData.sleepStruggle.min === 0 && sleepData.sleepStruggle.max === 2
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => handleStruggleChange("0-2")}
                      disabled={loading}
                    >
                      0-2 hours
                    </Button>
                    <Button
                      className="changeButton"
                      color={
                        sleepData.sleepStruggle.min === 2 && sleepData.sleepStruggle.max === 8
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => handleStruggleChange("2-8")}
                      disabled={loading}
                    >
                      2-8 hours
                    </Button>
                    <Button
                      className="changeButton"
                      color={
                        sleepData.sleepStruggle.min === 8 && sleepData.sleepStruggle.max === 10
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => handleStruggleChange("8-10")}
                      disabled={loading}
                    >
                      8+ hours
                    </Button>
                  </FormGroup>
                </>
              )}
              {currentPage === 3 && (
                <>
                  <h3>What time do you go to bed?</h3>
                  <div>Please enter your typical bedtime</div>
                  <br />
                  <br />
                  <FormGroup>
                    <Input
                      type="time"
                      name="bedTime"
                      value={sleepData.bedTime}
                      onChange={handleTimeChange}
                      required
                      disabled={loading}
                    />
                  </FormGroup>
                </>
              )}
              {currentPage === 4 && (
                <>
                  <h3>What time do you wake up?</h3>
                  <div>Please enter your typical wake time</div>
                  <br />
                  <br />
                  <FormGroup>
                    <Input
                      type="time"
                      name="wakeTime"
                      value={sleepData.wakeTime}
                      onChange={handleTimeChange}
                      required
                      disabled={loading}
                    />
                  </FormGroup>
                </>
              )}
              {currentPage === 5 && (
                <>
                  <h3>How many hours of sleep do you get each night?</h3>
                  <div>Please enter the average number of hours you sleep</div>
                  <br />
                  <br />
                  <FormGroup>
                    <Input
                      type="number"
                      name="sleepDuration"
                      value={sleepData.sleepDuration}
                      onChange={handleDurationChange}
                      min="0"
                      max="24"
                      step="0.5"
                      required
                      disabled={loading}
                    />
                  </FormGroup>
                  <div className="submit-container mt-4">
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
                        <FaArrowRight className="arrow-icon" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </Form>
          </div>
          {currentPage !== 0 && currentPage !== 5 && (
            <div className="col-12 col-md-2">
              <div className="submit-container">
                <button
                  className="submit-button"
                  onClick={handlenextArrowClick}
                  disabled={loading}
                >
                  <FaArrowRight className="arrow-icon" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
