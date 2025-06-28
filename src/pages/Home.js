import React from "react";
import { Link } from "react-router-dom";
import { Button } from 'reactstrap'
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();
  
  return (
    <>
      <div className='App'>
        <Link className='logButton' to="/home" ><img src="./wysa.png" className="App-logo" alt="logo" /></Link>
        <h4 style={{color:"white"}}>Hey! I'm <span style={{color:"#2aaacd"}}>Wysa</span></h4>
            <br></br>
        <p style={{color:"white"}}>I'm here to help you sleep better</p>
            <br></br>
        {currentUser ? (
            <div className="container">
                <h4 style={{color:"white"}}>Welcome back, {currentUser.displayName}!</h4>
                <div className="row">
                    <div className="col">
                        <Link className='logButton' to="/dashboard" ><Button className='logButton' color="primary">
                            View Dashboard 
                        </Button></Link>
                    </div>
                </div>
            </div>
        ) : (
            <div className="container">
                <div className="row">
                    <div className="col-6 text-end">
                        <Link className='logButton' to="/login" ><Button className='logButton' color="primary">
                            Login 
                        </Button></Link>
                    </div>
                    <div className="col-6 text-start">
                        <Link className='logButton' to="/signup" ><Button className='logButton' color="primary">
                            Signup 
                        </Button></Link>
                    </div>
                </div>
            </div>
        )}
      </div>
    </>
  );
};

export default Home;
