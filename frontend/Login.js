"use client";
import React, { useState } from 'react';
import { Drawer, ListItem, List, ListItemText, IconButton, Container, Typography, Button, Grid, AppBar, Toolbar, Box, Fade, Link, Stack, TextField, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useForm } from "react-hook-form";
// Ensure Error is available in this scope (global JS Error)
import { Anton } from "next/font/google";
const menuItems = ['About Us', 'Register', 'Login'];const anton = Anton({
  weight: "400",
  subsets: ["latin"],
});

const Login = ({ onLoginSuccess }) => {
  const [open, setOpen] = useState(false);
  const [fade, setFade] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [showForm, setShowForm] = useState(false); // New state to control form visibility
  const { register, handleSubmit } = useForm();
  const [showForgotPassword, setShowForgotPassword] = useState(false); 

   // Replace your onSubmit function in Login.js with this:
const onSubmit = async (data) => {
  setLogin(true);
  setErrorMsg(null);
  
  const endpoint = isRegister
    ? 'http://localhost:5001/api/users/register'
    : 'http://localhost:5001/api/users/login';
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();
      alert(result.error || result.message || 'Request failed');
      return;
    }
    const result = await response.json();
    if (isRegister) {
      alert('Registration successful! Please log in.');
      setIsRegister(false);
    } else {
      // Login success
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      onLoginSuccess(); // Let page.tsx fetch boxes from database
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    alert('Could not reach the server. Please try again.');
    setErrorMsg(error.message);
  } finally {
    setLogin(false);
  }
};
   const onForgotPasswordSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5001/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await response.json();
      
      if (response.ok) {
        alert('Password reset email sent! Please check your inbox.');
        setShowForgotPassword(false);
      } else {
        alert(result.message || 'Failed to send reset email');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  // Handler for Register button click
  const handleRegisterClick = () => {
    setIsRegister(true);
    setShowForm(true);
  };

  // Handler for Login button click
  const handleLoginClick = () => {
    setIsRegister(false);
    setShowForm(true);
  };
  const handleForgotPasswordClick= () => {
    setShowForgotPassword(true);
    showForgotPassword();
  };
return (
  <Box sx={{ 
    minHeight: '100vh', 
    fontFamily: 'Roboto, sans-serif',
    background: 'linear-gradient(135deg, rgb(7, 4, 21) 0%, #1e323e 100%)'  
  }}>
    {/* Navigation Bar */}
    <AppBar position="static" sx={{ 
      background: 'none', 
      boxShadow: 'none',
      position: { xs: 'absolute', md: 'static' },
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#eff5f6ff' }}>
          <img 
            src="/KTIX.png" 
            alt="KTIX Logo" 
            style={{ 
              width: '30vh', 
              height: '10vh', 
              marginRight: '8px', 
              verticalAlign: 'middle' 
            }} 
          />
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>        
          {['About Us', 'Register', 'Login'].map((item) => (
            <Button 
              key={item} 
              color="inherit" 
              onClick={()=> {
                if(item === 'About Us'){
                  window.open('https://ktixlabs.com/','_blank');
                }else if (item === 'Register'){
                  handleRegisterClick();
                }else if (item === 'Login'){
                  handleLoginClick();
                }
              }}
              sx={{ 
                mr: 2, 
                cursor: 'pointer',
                '&:hover': { 
                  transform: 'scale(1.2)',
                  transition: 'transform 0.2s ease-out',
                  textShadow: '0 0 10px rgba(75, 222, 242, 0.66)' 
                } 
              }}
            >
              {item}
            </Button>
          ))}
        </Box>
        
        {/* Mobile: Show "About Us" text */}
        <Typography 
        onClick={() => {
          window.open('https://ktixlabs.com','_blank');
        }}
          sx={{ 
            display: { xs: 'block', md: 'none' },
            color: '#eff5f6ff',
            fontSize: '16px'
          }}
        >
          About Us
        </Typography>
      </Toolbar>
    </AppBar>

    {/* Drawer */}
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <List sx={{ width: 250 }}>
        {menuItems.map((item) => (
          <ListItem component="button" key={item} onClick={() => setOpen(false)}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Drawer>

    {/* Hero Section */}
    <Container sx={{
      height: { xs: 'auto', sm: '90%', md: '100%', xlg: '300%' }, 
      width: { xs: '100%', sm: '80%' },
      boxShadow: { xs: 'none', md: '0 0 20px rgba(0, 0, 0, 0.5)' },
      backgroundColor: { xs: 'transparent', md: 'rgba(75, 75, 75, 0.93)' }, 
      borderRadius: { xs: 0, md: '35px' },
      padding: { xs: 0, md: 'default' },
      position: { xs: 'relative', md: 'static' },
      minHeight: { xs: '100vh', md: 'auto' }
    }}>
      <Grid container spacing={{ xs: 0, md: 4 }} alignItems="center">
        {/* Text and Form Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{
            px: { xs: 3, md: 0 },
            py: { xs: 0, md: 0 },
            position: { xs: 'relative', md: 'static' },
            zIndex: { xs: 2, md: 'auto' },
            minHeight: { xs: '100vh', md: 'auto' },
            display: { xs: 'flex', md: 'block' },
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'space-between', md: 'flex-start' }
           } }>
{/* Title and subtitle container - Top on mobile, normal on desktop */}
{!showForm && ( // Only show when form is hidden
  <Box sx={{
    textAlign:'left',
    pt: { xs: 40, md: 0 },
    pb: { xs: 2, md: 0 },
    pl:{xs:0, md:5}
  }}>
    <Typography
      variant="h4"
      sx={{
        display:'block',
        fontFamily: 'Anton, sans-serif',
        mt: { xs: 'auto' },
        mb: 2,
        color: '#fff',
        textAlign: 'left',
        textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
        fontWeight: 'normal',
        fontSize: { xs: '32px', sm: '38px', md: '50px' },
        letterSpacing: '0.5px'
      }}
    >
      {/* Mobile: Show "KtixLabs" */}
      <Box component="span" sx={{ display: 'block' }}>
        Ktix Labs
      </Box>
      {/* Desktop: Show original text */}
    
    </Typography>

    {/* Mobile: Show "E-Learning platforme" as separate heading */}
    <Typography
      variant="h4"
      sx={{
        display:'block',
        fontFamily: 'Anton, sans-serif',
        mt: { xs: 'auto' },
        mb: 2,
        color: '#fff',
        textAlign: 'left',
        textShadow: '2px 2px 8px rgba(0,0,0,0.9)',
        fontWeight: 'normal',
        fontSize: { xs: '32px', sm: '38px', md: '50px' },
        letterSpacing: '0.5px'
      }}
    >
      E-Learning platforme
    </Typography>

    <Typography 
      variant="h5" 
      sx={{
        fontFamily:  'sans-serif',
        maxWidth: { xs: '100%' },
        display: 'block',
        textAlign:'left',
        color:'#fff',
        textShadow: '1px 1px 4px rgba(0,0,0,0.9)',
        fontSize: { xs: '16px', sm: '18px', md: '18px', lg: '20px', xlg: '45px' },
        mb: { xs: 0, md: 2 },
        fontWeight: { xs: 'normal', md: 'normal' },
        letterSpacing: { xs: '0.3px', md: 'normal' }
      }}
    >
      Become the expert on your domain
      and explore more and more                   
    </Typography>
  </Box>
)}

            {/* Form - Center on mobile when visible */}
{/* Form - Center on mobile when visible */}
{showForm && (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: { xs: 1, md: 'none' },
    py: { xs: 2, md: 0 },
    minHeight: { xs: '100vh', md: 'auto' }, // Full height on mobile
    position: { xs: 'absolute', md: 'static' }, // Absolute positioning on mobile
    top: { xs: 0, md: 'auto' },
    left: { xs: 0, md: 'auto' },
    right: { xs: 0, md: 'auto' },
    zIndex: { xs: 3, md: 'auto' } // Above video overlay
  }}>
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Fade in={showForm} timeout={500}>
        <Stack spacing={1} sx={{ 
          width: '100%',
          maxWidth: { xs: '100%', sm: 450, md: 400, lg: 500 }, 
          mx: 'auto', 
          p: 2, 
          boxSizing: 'border-box',
          alignItems: 'center' // Center align items in stack
        }}>
          <Typography variant="h5" textAlign="center" color="#0edff1">
            {isRegister ? "Register" : "Login"}
          </Typography>

          

          <TextField
            label="E-mail"
            {...register("email", { required: true })}
            fullWidth
            sx={{ borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255)', height: '45px' }}
          />
          <TextField
            label="Password"
            type="password"
            {...register("password", { required: true })}
            fullWidth
            sx={{ borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255)', height: '45px' }}
          />

          {isRegister && (
            <>
            <TextField
            label="UserName"
            {...register("userName", { required: true })}
            fullWidth
            sx={{ borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255)', height: '45px' }}
          />
            <TextField
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", { required: true })}
              fullWidth
              sx={{ borderRadius: '10px', backgroundColor: 'rgb(255, 255, 255)', height: '45px' }}
            /></>
          )}  
          {/* Forgot Password Form */}
{showForgotPassword && (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: { xs: 1, md: 'none' },
    py: { xs: 2, md: 0 },
    minHeight: { xs: '100vh', md: 'auto' },
    position: { xs: 'absolute', md: 'static' },
    top: { xs: 0, md: 'auto' },
    left: { xs: 0, md: 'auto' },
    right: { xs: 0, md: 'auto' },
    zIndex: { xs: 3, md: 'auto' }
  }}>
    <form onSubmit={handleSubmit(onForgotPasswordSubmit)} style={{ width: '90%' }}>
      <Fade in={showForgotPassword} timeout={500}>
        <Stack spacing={2} sx={{ 
          width: '100%',
          maxWidth: { xs: '100%', sm: 450, md: 400, lg: 500 }, 
          mx: 'auto', 
          p: 3, 
          boxSizing: 'border-box',
          alignItems: 'center',
          backgroundColor: { xs: 'rgba(0, 0, 0, 0.7)', md: 'transparent' },
          borderRadius: '15px'
        }}>
          <Typography variant="h5" textAlign="center" color="#c689f5" fontWeight="bold">
            Reset Password
          </Typography>

          <Typography variant="body2" textAlign="center" color="#fff" sx={{ mb: 2 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          <TextField
            label="Email Address"
            {...register("email", { 
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            })}
            fullWidth
            type="email"
            sx={{ 
              borderRadius: '10px', 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
          />

          {/* Submit Button */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '100%',
              gap: 2,
              mt: 2
            }}
          >
            <Button 
              type="submit"
              variant="contained"
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                color: '#fff',
                flex: 1,
                maxWidth: '200px',
                borderRadius: "10px",
                textTransform: 'none',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                }
              }}
            >
              Send Reset Link
            </Button>

            <Button 
              variant="outlined"
              onClick={() => {
                setShowForgotPassword(false);
                setShowForm(true);
              }}
              sx={{ 
                px: 4, 
                py: 1.5, 
                fontSize: '0.9rem',
                color: '#fff',
                flex: 1,
                maxWidth: '200px',
                borderRadius: "10px",
                borderColor: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'none',
                '&:hover': { 
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Creat New Password
            </Button>
          </Box>

          <Typography textAlign="center" fontSize={14} color="#fff" sx={{ mt: 2 }}>
            login now{" "}
            <Link
              href="#"
              variant="body2"
              underline="hover"
              sx={{ color: '#af9bffff', fontWeight: 'bold' }}
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(false);
                setShowForm(true);
                setIsRegister(false);
              }}
            >
              Login Now
            </Link>
          </Typography>
        </Stack>
      </Fade>
    </form>

  </Box>
)}
          {!isRegister && (
            <Link
              href="#"
              variant="body2"
              underline="hover"
              textAlign="center"
              sx={{ color: '#f2f2f2' }}
              onClick = {(e) => {
                e.preventDefault();
                handleForgotPasswordClick();
              }}
            >
              Forget Password?
            </Link>
          )}

          {/* Centered button container */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Button 
              type="submit"
              variant="contained"
              sx={{ 
                px: 3, 
                py: 1.5, 
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                color: '#fff',
                width: '50%',
                borderRadius: "10px",
                textTransform: 'none',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                  display:'block',
                  alignItems:'center',
                }
              }}
            >
              {isRegister ? "Register" : "Login"}
            </Button>
          </Box>

          <Typography textAlign="center" fontSize={15} color="#fff">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              href="#"
              variant="body2"
              underline="hover"
              sx={{ color: '#af9bffff' }}
              onClick={(e) => {
                e.preventDefault();
                setIsRegister(!isRegister);
              }}
            >
              {isRegister ? "Login Now" : "Register Now"}
            </Link>
          </Typography>
        </Stack>
      </Fade>
    </form>
  </Box>
)}

            {/* Buttons - Bottom on mobile when form is hidden */}
            {!showForm && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                justifyContent:'center', 
                alignItems: 'center', 
                gap: 2,
                width: { xs: '100%', md: 'auto' },
                pb: { xs: 4, md: 0 },
                mt: { xs: 'auto', md: 0 }
              }}>
                <Button 
                  variant="contained" 
                  onClick={handleRegisterClick}
                  sx={{ 
                    display:'block',
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor: { xs: 'transparent', md: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' },
                    background: { xs: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' },
                    borderRadius: '10px',
                    px: 4,
                    py: 1.5,
                    width: { xs: '100%', md: 'auto' },
                    maxWidth: { xs: '400px', md: 'none' },
                    fontSize: { xs: '16px', md: 'default' },
                    textTransform: { xs: 'none', md: 'uppercase' },
                    boxShadow: { xs: '0 4px 15px rgba(139, 92, 246, 0.4)', md:'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'},
                    '&:hover': {
                    background: { xs: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)' },
                      boxShadow: { xs: '0 6px 20px rgba(139, 92, 246, 0.6)', md: '0 0 25px rgb(120, 178, 255)' },
                    },
                  }}
 >
                  {/* Mobile: "Register Now" | Desktop: "Register" */}
                  <Box component="span" sx={{ display:'block' }}>
                    Register Now
                  </Box>
                  
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={handleLoginClick}
                  sx={{ 
                    color: { xs: '#fff', md: '#58c3d1' },
                    boxShadow: { xs: 'none', md: '0 0 15px rgb(148, 233, 242)' },
                    borderRadius: '10px',
                    px: 4,
                    py: 1.5,
                     width: { xs: '100%', md: 'auto' },
                    maxWidth: { xs: '400px', md: 'none' },
                    fontSize: { xs: '16px', md: 'default' },
                    textTransform: { xs: 'none', md: 'uppercase' },
                    borderColor: {  xs: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'  },
                    borderWidth: '2px',
                    backdropFilter:'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', md: 'rgba(77, 198, 231',
                    '&:hover': {
                      color: { xs: '#fff', md: 'rgb(77, 152, 232)' },
                      borderColor: { xs: 'rgba(20, 195, 248, 0.5)', md: '#58c3d1' },
                      backgroundColor: { xs: 'rgb(77, 152, 232)', md: 'transparent' },
                      boxShadow: { xs: 'none', md: '0 0 25px rgb(120, 178, 255)' },
                      borderWidth: '2px',
                    } 
                  }}
                >
                  {/* Mobile: "Log in Now" | Desktop: "Login" */}
                  <Box component="span" sx={{ display:'block'}}>
                    Log in Now
                  </Box>
                  
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Video Section */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ padding: { xs: 0, md: 'default' } }}>
          <Box sx={{ 
            position: { xs: 'absolute', md: 'relative' },
            top: { xs: 0, md: 'auto' },
            left: { xs: 0, md: 'auto' },
            width: '100%', 
            height: { xs: '100vh', md: '80vh' },
            overflow: 'hidden',
            borderRadius: { xs: 0, md: '20px' },
            zIndex: { xs: 0, md: 'auto' }
          }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'grayscale(100%)',
              }}
            >
              <source src='/bg.mp4' type="video/mp4" />
            </video>
            
            {/* Dark overlay on mobile only */}
            <Box sx={{
              display: { xs: 'block', md: 'none' },
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
              zIndex: 1
            }} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
}
export default Login;