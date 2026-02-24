'use client';
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import {
  Container, Card, CardContent, Typography, Box,
  Grid, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Snackbar,
} from "@mui/material";
import { useForm } from "react-hook-form";

const LockedDashboard = ({ onLogout, onUnlockSuccess }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleOpenBoxClick = () => { setOpenDialog(true); reset(); };
  const handleCloseDialog  = () => { setOpenDialog(false); reset(); };
  const handleCloseAlert   = () => setShowAlert(false);

  const onSubmitCode = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/boxes/unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ unlockCode: data.boxCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setAlertType('success');
        setAlertMessage('🎉 Box unlocked successfully!');
        setShowAlert(true);
        handleCloseDialog();
        setTimeout(() => { onUnlockSuccess(); }, 1000);
      } else {
        setAlertType('error');
        setAlertMessage(result.error || 'Invalid unlock code');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Unlock error:', error);
      setAlertType('error');
      setAlertMessage('Could not reach server');
      setShowAlert(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* ✅ No unlockedBoxes here — selectedBoxId is simply null */}
      <Sidebar showEmptyState={true} desktop={true} onClose={() => {}} onSelect={() => {}} selectedBoxId={null} onLogout={onLogout} />

      <Container sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 4 }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Typography variant="h4" sx={{ color: '#fff', fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }, textAlign: { xs: 'center', sm: 'left' } }}>
            Your Boxes
          </Typography>
          {/* No Start Assembly button on locked dashboard */}
        </Box>

        {/* Snackbar */}
        <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: '100%', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {alertMessage}
          </Alert>
        </Snackbar>

        {/* Unlock Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth
          PaperProps={{ sx: { backgroundColor: 'rgba(30,30,30,0.95)', backdropFilter: 'blur(10px)', borderRadius: 3, border: '2px solid rgba(128,98,248,0.3)' } }}>
          <DialogTitle sx={{ color: '#fff', textAlign: 'center', fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 600 }}>
            🔓 Unlock your Box
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmitCode)}>
            <DialogContent>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3, textAlign: 'center', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                the unlock code is on the card you received with your box. Enter it below to access the content and start your assembly journey!
              </Typography>
              <TextField
                {...register("boxCode", { required: "Le code est requis", minLength: { value: 4, message: "Le code doit contenir au moins 4 caractères" } })}
                label="Code de la Box" placeholder="Entrez votre code..." fullWidth autoFocus
                error={!!errors.boxCode} helperText={errors.boxCode?.message}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.95)', fontSize: { xs: '0.875rem', sm: '1rem' } },
                  '& .MuiInputLabel-root': { color: '#666' },
                  '& .MuiFormHelperText-root': { color: '#f44336' },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined"
                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', borderRadius: '10px', px: 3, textTransform: 'none', fontSize: { xs: '0.875rem', sm: '1rem' }, '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained"
                sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', borderRadius: '10px', px: 3, textTransform: 'none', fontSize: { xs: '0.875rem', sm: '1rem' }, '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)' } }}>
                Unlock
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* ✅ Single centered unlock card — no boxes/loading state needed here */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', width: '100%' }}>
          <Card sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)', backgroundColor: 'rgba(30,30,30,0.8)', color: '#fff',
            p: { xs: 2, sm: 3 }, maxWidth: '900px', width: '100%',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 20px rgba(6,112,136,0.2)',
            borderRadius: { xs: 2, md: 3 }, border: '2px solid rgba(0,186,210,0.3)',
            position: 'relative', overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', transition: 'left 0.5s' },
            '&:hover::before': { left: '100%' },
          }}>
            <CardContent sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">

                {/* Left — text + button */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#fff', textShadow: '0 0 10px rgba(128,98,248,0.5)', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, textAlign: { xs: 'center', md: 'left' } }}>
                    Ktix's Boxes
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: '#b0b0b0', display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' }, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                    🔒 Unlock your first box
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Button onClick={handleOpenBoxClick} variant="contained"
                      sx={{ color: '#fff', fontWeight: 600, background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', padding: { xs: '10px 24px', sm: '12px 32px' }, borderRadius: '12px', fontSize: { xs: '0.875rem', sm: '1rem' }, textTransform: 'none', boxShadow: '0 4px 15px rgba(128,98,248,0.4)', '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)', boxShadow: '0 6px 20px rgba(128,98,248,0.6)', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}>
                      Unlock Now
                    </Button>
                  </Box>
                </Grid>

                {/* Right — lock image */}
              <Grid 
  item 
  xs={12} 
  md={6}  
  sx={{ 
    display: 'flex', 
    justifyContent: 'flex-end',  // ✅ right
    alignItems: 'flex-start',    // ✅ top
    mt: { xs: 3, md: 0 } 
  }}
>
  <Box 
    sx={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      cursor: 'pointer', 
      '&:hover img': { 
        transform: 'scale(1.1) rotate(5deg)', 
        filter: 'drop-shadow(0 0 20px rgba(128,98,248,0.6))' 
      } 
    }}
    onClick={handleOpenBoxClick}
  >
    <img 
      src="lock.png" 
      alt="lock" 
      style={{ 
        width: '100%', 
        maxWidth: '220px', 
        height: 'auto', 
        objectFit: 'contain', 
        filter: 'drop-shadow(0 0 15px rgba(128,98,248,0.4))', 
        transition: 'all 0.3s ease',
        display: 'block',        // ✅ removes inline spacing
      }} 
    />
    <Box 
      sx={{ 
        position: 'absolute', 
        top: 0,                  // ✅ anchor pulse to top
        right: 0,                // ✅ anchor pulse to right
        width: { xs: '200px', sm: '240px' }, 
        height: { xs: '200px', sm: '240px' }, 
        borderRadius: '50%', 
        background: 'radial-gradient(circle, rgba(128,98,248,0.2) 0%, transparent 70%)', 
        animation: 'pulse 2s infinite', 
        '@keyframes pulse': { 
          '0%,100%': { opacity: 0.5, transform: 'scale(1)' }, 
          '50%': { opacity: 1, transform: 'scale(1.1)' } 
        } 
      }} 
    />
  </Box>
</Grid>

              </Grid>
            </CardContent>
          </Card>
        </Box>
  <Typography 
    variant="body1" 
    sx={{ 
      textAlign: 'center', 
      color: '#b0b0b0',
      mt: 4,
      fontSize: { xs: '0.875rem', sm: '1rem' }
    }}
  >
    No boxes unlocked yet. Unlock your first box to get started!
  </Typography>

      </Container>
    </Box>
  );
};

export default LockedDashboard;