import React from 'react'
import { Navigate, Route, Routes } from "react-router-dom";

import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Dashboard from './Dashboard';
import Onboarding from './Onboarding';
import Profile from './Profile';
import SleepAnalysis from './SleepAnalysis';

const Pages = () => {
    return (
        <Routes>
            <Route path="*" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/onboarding" element={<Onboarding/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/sleep-analysis" element={<SleepAnalysis/>} />
        </Routes>
    )
}

export default Pages