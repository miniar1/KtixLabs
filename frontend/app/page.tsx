'use client';
import { useState, useEffect } from "react";
import { Box, CircularProgress } from '@mui/material';
import Login from '../Login.js';
import LockedDashboard from '../LockedDashboard.js';
import UnlockedDashboard from '../UnlockedDashboard.js';


export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [authState, setAuthState] = useState('loading');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    checkAuthAndBoxes();
  }, [mounted]);

  const checkAuthAndBoxes = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setAuthState('loggedOut');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        setAuthState('loggedOut');
        return;
      }
      const user = await response.json();
      setAuthState(user.statut === 'unlocked' ? 'unlocked' : 'locked');
    } catch (error) {
    setAuthState('loggedOut');
  }
};

  const handleLoginSuccess = () => {
    checkAuthAndBoxes();
  };

  const handleUnlockSuccess = () => {
    setAuthState('unlocked');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState('loggedOut');
  };

  if (!mounted ) return null;
  if (authState === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
        <CircularProgress sx={{ color: '#8062f8' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#1a1a2e', color: '#fff', minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
      {authState === 'loggedOut' && <Login onLoginSuccess={handleLoginSuccess} />}
      {authState === 'locked' && <LockedDashboard onLogout={handleLogout} onUnlockSuccess={handleUnlockSuccess} />}
      {authState === 'unlocked' && <UnlockedDashboard onLogout={handleLogout} />}
    </Box>
  );
}