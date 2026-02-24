'use client';
import React, { useEffect, useState,useRef } from "react";
import Sidebar from "./Sidebar";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IoDocumentTextOutline } from "react-icons/io5";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {
  Container, Card, CardContent, Typography, Box,
  Grid, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Snackbar,
  CircularProgress,ButtonGroup, IconButton, Paper
} from "@mui/material";
import { useForm } from "react-hook-form";

const UnlockedDashboard = ({ onLogout }) => {
  const [unlockedBoxes, setUnlockedBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [boxData, setBoxData] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [assemblyMode, setAssemblyMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [openTheorie, setOpenTheorie] = useState(false);
 // Add this ref at the top of your component
const activeStepRef = useRef(null);
const stepsBarRef = useRef(null);

// Add this effect to scroll to active step whenever it changes
useEffect(() => {
  if (activeStepRef.current && stepsBarRef.current) {
    const container = stepsBarRef.current;
    const activeEl = activeStepRef.current;
    const scrollLeft = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }
}, [currentStepIndex]);
const assemblySteps = boxData?.steps?.flatMap(step =>
  step.substeps?.map(sub => ({
    id: `${step.stepNumber}-${sub.substepNumber}`,
    name: sub.title,
    stepTitle: step.title,
    stepNumber: step.stepNumber,
    substepNumber: sub.substepNumber,
    description: sub.description || '',        // HTML parsed from MD
    image: sub.processedImages?.find(img => img.exists)?.url 
  ? sub.processedImages.find(img => img.exists).url
  : '/lock.png',
   
    validation: sub.validation,
  })) || []
) || [];

    const theoryContent = boxData?.steps?.map(step => ({
    title: step.title,
    difficulty: step.difficulty || 'Beginner',
    formula: step.formula || null,
    rawHtml: step.theory || null,
  })) || [];

  const getParentStepIndex = (flatIndex) => {
    if (!boxData?.steps) return 0;
    let count = 0;
    for (let i = 0; i < boxData.steps.length; i++) {
      const subLen = boxData.steps[i].substeps?.length || 0;
      if (flatIndex < count + subLen) return i;
      count += subLen;
    }
    return 0;
  };
  const parentStepIndex = getParentStepIndex(currentStepIndex);
 // Map unlockedBoxes → boxes shape expected by the UI
  const boxes = unlockedBoxes.map(box => ({
    ...box,
    isLocked: false,
    name: boxData?.title || box.name || 'Box',
    description: boxData?.description || '',
  }));
  
const hasUnlockedBox = unlockedBoxes.length > 0;

  const handleCloseAlert = () => setShowAlert(false);


  const loadBoxContent = async (boxId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5001/api/boxes/${boxId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to load box');
    return await response.json();
  };

  const fetchUserBoxes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/boxes/my-boxes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const boxes = await response.json();
        setUnlockedBoxes(boxes);
      }
    } catch (error) {
      console.error('Error fetching boxes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBoxes();
  }, []);

  // Charge le contenu quand les boxes sont disponibles
  useEffect(() => {
    if (unlockedBoxes.length > 0) {
      loadBoxContent(unlockedBoxes[0].boxId).then(setBoxData).catch(console.error);
    }
  }, [unlockedBoxes]);


  const handleOpenBoxClick = () => { setOpenDialog(true); reset(); };
  const handleCloseDialog = () => { setOpenDialog(false); reset(); };

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
        setAlertMessage('🎉 New box unlocked!');
        setShowAlert(true);
        handleCloseDialog();
        fetchUserBoxes();
      } else {
        setAlertType('error');
        setAlertMessage(result.error || 'Invalid code');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Could not reach server');
      setShowAlert(true);
    }
  };
    const handleStartAssembly = () => {setAssemblyMode(true);setCurrentStepIndex(0);};
    const handleExitAssembly = () => {setAssemblyMode(false); setCurrentStepIndex(0);}; 
    const handleStepClick = (index) => {setCurrentStepIndex(index);};
    const handlePreviousStep = () => { setCurrentStepIndex(prev => Math.max(0, prev - 1));};
    const handleNextStep = () => {setCurrentStepIndex(prev => Math.min(assemblySteps.length - 1, prev + 1));};
    const handleOpenTheorie = (e) => {e.stopPropagation();setOpenTheorie(true);}
    const handleCloseTheorie = () => {setOpenTheorie(false);}
// Add this handler in UnlockedDashboard
const handleSidebarStepSelect = (step) => {
  // Find the flat index of the FIRST substep of this step
  const flatIndex = assemblySteps.findIndex(
    s => s.stepNumber === step.stepNumber
  );
  if (flatIndex !== -1) {
    setCurrentStepIndex(flatIndex);
    setAssemblyMode(true); // ✅ opens assembly mode automatically
  }
};
if (assemblyMode) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row', // ✅ always row
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#1a1a2e',
    }}>
      {/* ✅ Hide sidebar on mobile in assembly mode */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar showEmptyState={false} onLogout={onLogout}  onSelect={handleSidebarStepSelect}/>
      </Box>

      {/* Main Assembly Area */}
      <Box sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1a1a2e',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 1, md: 2 },
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10,
          flexShrink: 0,
          gap: 1,
        }}>
          <IconButton
            onClick={handleExitAssembly}
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
              flexShrink: 0,
              '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.4)' }
            }}>
            <ArrowBackIosNewIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
          </IconButton>

          {/* ✅ Centered title using flex:1 instead of absolute */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography sx={{
              color: '#fff', fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '1.5rem' },
              lineHeight: 1.2
            }}>
              Assembly Mode
            </Typography>
            <Typography sx={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: { xs: '0.7rem', md: '0.85rem' },
              fontStyle: 'italic'
            }}>
              Step {currentStepIndex + 1} of {assemblySteps.length}
            </Typography>
          </Box>

          <Button
            onClick={handleOpenTheorie}
            sx={{
              background: 'linear-gradient(135deg, #080c8d 0%, #0891b2 100%)',
              color: '#fff',
              px: { xs: 1.5, md: 3 },
              py: { xs: 0.75, md: 1.5 },
              borderRadius: '10px',
              fontSize: { xs: '0.7rem', md: '1rem' },
              fontWeight: 600,
              textTransform: 'none',
              flexShrink: 0,
              minWidth: 'auto',
              boxShadow: '0 4px 15px rgba(107, 255, 250, 0.4)',
              display: 'flex', alignItems: 'center', gap: 0.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #5900f4 0%, #18afd5 100%)',
              },
            }}
          >
            {/* ✅ Hide text on mobile, show icon only */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>THEORY</Box>
            <IoDocumentTextOutline size={18} />
          </Button>
        </Box>

        {/* Content Area */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          position: 'relative',
          minHeight: 0,
        }}>

          {/* Image Section */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Left Arrow */}
            <IconButton
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
              sx={{
                position: 'absolute', left: { xs: 4, md: 20 }, zIndex: 10,
                backgroundColor: 'rgba(128, 98, 248, 0.2)', color: '#fff',
                width: { xs: 32, md: 50 }, height: { xs: 32, md: 50 },
                '&:hover': { backgroundColor: 'rgba(128, 98, 248, 0.5)' },
                '&.Mui-disabled': { opacity: 0.2 }
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: { xs: 14, md: 24 } }} />
            </IconButton>

            {/* Image */}
            <Box sx={{
              textAlign: 'center',
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              animation: 'fadeIn 0.3s ease-in',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'scale(0.95)' },
                to: { opacity: 1, transform: 'scale(1)' }
              }
            }}>
              <Box
                component="img"
                src={`http://localhost:5001${assemblySteps[currentStepIndex]?.image}`}
                alt="step"
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  maxHeight: { xs: '40vh', md: '65vh' }, // ✅ smaller on mobile
                  objectFit: 'contain',
                  transition: 'all 0.3s ease',
                }}
                onError={(e) => { e.target.src = '/lock.png'; }}
              />
            </Box>

            {/* Right Arrow */}
            <IconButton
              onClick={handleNextStep}
              disabled={currentStepIndex === assemblySteps.length - 1}
              sx={{
                position: 'absolute', right: { xs: 4, md: 20 }, zIndex: 10,
                backgroundColor: 'rgba(128, 98, 248, 0.2)', color: '#fff',
                width: { xs: 32, md: 50 }, height: { xs: 32, md: 50 },
                '&:hover': { backgroundColor: 'rgba(128, 98, 248, 0.5)' },
                '&.Mui-disabled': { opacity: 0.2 }
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: { xs: 14, md: 24 } }} />
            </IconButton>
          </Box>

          {/* Theory Panel - always absolute overlay */}
          {openTheorie && (
            <ClickAwayListener onClickAway={handleCloseTheorie}>
              <Box sx={{
                width: { xs: '100%', sm: '70%', md: '33%' },
                height: '100%',
                backgroundColor: 'rgba(15, 15, 35, 0.98)',
                backdropFilter: 'blur(20px)',
                borderLeft: '2px solid rgba(128, 98, 248, 0.4)',
                display: 'flex', flexDirection: 'column',
                position: 'absolute', right: 0, top: 0,
                zIndex: 20,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(128, 98, 248, 0.5)', borderRadius: 3 }
              }}>
                {/* Theory Header */}
                <Box sx={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  p: { xs: 1.5, md: 2.5 },
                  borderBottom: '1px solid rgba(128, 98, 248, 0.3)',
                  background: 'linear-gradient(135deg, rgba(8,12,141,0.5) 0%, rgba(8,145,178,0.3) 100%)',
                  position: 'sticky', top: 0, zIndex: 1
                }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.95rem' } }}>
                    📄 {theoryContent[parentStepIndex]?.title || 'Theory'}
                  </Typography>
                  <IconButton onClick={handleCloseTheorie} sx={{ color: '#fff', p: 0.5, '&:hover': { color: '#ff6b6b' } }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Theory HTML Content */}
                <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
                  {theoryContent[parentStepIndex]?.rawHtml ? (
                    <Box
                      sx={{
                        color: '#b0b0b0',
                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                        lineHeight: 1.7,
                        '& h1': { color: '#fff', fontSize: '1rem', fontWeight: 700, mb: 1, mt: 0 },
                        '& h2': { color: '#58c3d1', fontSize: '0.95rem', fontWeight: 600, mb: 1 },
                        '& h3': { color: '#58c3d1', fontSize: '0.9rem', fontWeight: 600, mb: 1 },
                        '& p': { mb: 1 },
                        '& ul, & ol': { pl: 2, mb: 1 },
                        '& li': { mb: 0.5 },
                        '& strong': { color: '#fff' },
                      }}
                      dangerouslySetInnerHTML={{ __html: theoryContent[parentStepIndex].rawHtml }}
                    />
                  ) : (
                    <Typography sx={{ color: '#888', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
                      No theory available for this step yet
                    </Typography>
                  )}
                </Box>
              </Box>
            </ClickAwayListener>
          )}
        </Box>

        {/* Bottom Steps Bar */}
        <Paper
          ref={stepsBarRef}
          sx={{
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '2px solid rgba(128, 98, 248, 0.3)',
            p: { xs: 0.75, md: 2 },
            display: 'flex',
            justifyContent: 'flex-start',
            gap: { xs: 0.75, md: 2 },
            overflowX: 'auto',
            flexShrink: 0,
            '&::-webkit-scrollbar': { height: 3 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(128, 98, 248, 0.5)', borderRadius: 3 }
          }}
        >
          {assemblySteps.map((step, index) => (
            <Box
              key={step.id}
              ref={currentStepIndex === index ? activeStepRef : null}
              onClick={() => handleStepClick(index)}
              sx={{
                cursor: 'pointer',
                p: { xs: '4px 6px', md: 1 },
                borderRadius: 1.5,
                border: currentStepIndex === index
                  ? '2px solid rgb(98, 206, 248)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: currentStepIndex === index
                  ? 'rgba(98, 231, 248, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                minWidth: { xs: '44px', sm: '80px', md: '130px' },
                flexShrink: 0,
                textAlign: 'center',
              }}
            >
              {/* Step number - always visible */}
              <Typography sx={{
                color: currentStepIndex === index ? 'rgb(98, 206, 248)' : '#888',
                fontWeight: 700,
                fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.9rem' },
                display: 'block',
              }}>
                {step.stepNumber}.{step.substepNumber}
              </Typography>
              {/* Step name - hidden on xs */}
              <Typography sx={{
                display: { xs: 'none', sm: 'block' },
                color: currentStepIndex === index ? '#fff' : '#888',
                fontWeight: currentStepIndex === index ? 600 : 400,
                fontSize: { sm: '0.6rem', md: '0.7rem' },
                lineHeight: 1.2,
                mt: 0.25,
              }}>
                {step.name}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Description Box */}
        <Box sx={{
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          p: { xs: 1, md: 2 },
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          maxHeight: { xs: '90px', md: '140px' },
          overflowY: 'auto',
          flexShrink: 0,
          '&::-webkit-scrollbar': { width: 3 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(128, 98, 248, 0.5)', borderRadius: 3 }
        }}>
          {assemblySteps[currentStepIndex] && (
            <Box>
              <Typography sx={{
                color: 'rgb(98, 206, 248)', fontWeight: 600,
                mb: 0.5, fontSize: { xs: '0.72rem', md: '0.9rem' }
              }}>
                Step {assemblySteps[currentStepIndex].stepNumber}.{assemblySteps[currentStepIndex].substepNumber}: {assemblySteps[currentStepIndex].name}
              </Typography>
              <Typography
                component="div"
                sx={{
                  color: '#b0b0b0', lineHeight: 1.5,
                  fontSize: { xs: '0.75rem', md: '0.9rem' },
                  '& h1': { color: '#fff', fontSize: '0.95rem', fontWeight: 700, mb: 1, mt: 0 },
                  '& h2': { color: '#fff', fontSize: '0.875rem', fontWeight: 600, mb: 0.5 },
                  '& p': { mb: 0.5, color: '#b0b0b0', margin: 0 },
                  '& ul, & ol': { pl: 2, mb: 0.5 },
                  '& li': { mb: 0.25, color: '#b0b0b0' },
                  '& strong': { color: '#fff' },
                }}
                dangerouslySetInnerHTML={{ __html: assemblySteps[currentStepIndex].description }}
              />
            </Box>
          )}
        </Box>

      </Box>
    </Box>
  );
}
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidebar open={true} desktop={true} onClose={() => {}} onSelect={handleSidebarStepSelect} selectedBoxId={unlockedBoxes[0]?.id} onLogout={onLogout} />
      
      <Container sx={{ 
        py: { xs: 2, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: '100%'
      }}>
        {/* Header with Title and Start Assembly Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: { xs: 2, md: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#fff',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Your Boxes
          </Typography>

          {/* Start Assembly Button - Only show if box is unlocked */}
          
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartAssembly}
              sx={{
                    background: 'linear-gradient(135deg, #080c8d 0%, #0891b2 100%)',
                color: '#fff',
              
                px: { xs: 3, md: 4},
                py: { xs: 1, md: 1.5 },
                borderRadius: '10px',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(107, 255, 250, 0.4)',
                '&:hover': {
                    background: 'linear-gradient(135deg, #5900f4 0%, #18afd5 100%)',
                  boxShadow: '0 6px 20px rgba(130, 253, 253, 0.72)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Assembly
            </Button>
          
        </Box>

        {/* Snackbar for Alerts */}
        <Snackbar
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity={alertType}
            sx={{ 
              width: '100%',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>

         {/* Dialog for Box Code Input */}
         <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '2px solid rgba(128, 98, 248, 0.3)',
            }
          }}
         >
          <DialogTitle sx={{ 
            color: '#fff',
            textAlign: 'center',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600
          }}>
            🔓 Unlock a New Box
          </DialogTitle>
          
          <form onSubmit={handleSubmit(onSubmitCode)}>
            <DialogContent>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#b0b0b0', 
                  mb: 3,
                  textAlign: 'center',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                the unlock code is on the card you received with your box. Enter it below to access the content and start your assembly journey!
              </Typography>
              <TextField
                {...register("boxCode", { 
                  required: "Le code est requis",
                  minLength: {
                    value: 4,
                    message: "Le code doit contenir au moins 4 caractères"
                  }
                })}
                label="Code de la Box"
                placeholder="Entrez votre code..."
                fullWidth
                autoFocus
                error={!!errors.boxCode}
                helperText={errors.boxCode?.message}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666'
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#f44336'
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  px: 3,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                cancel
              </Button>
              <Button 
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                  borderRadius: '10px',
                  px: 3,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                  }
                }}
              >
                Unlock
              </Button>
            </DialogActions>
          </form>
        </Dialog>
{/* Cards Grid - Centered layout */}
  
{loading && (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6}}>
    <CircularProgress size={40} />
  </Box>
)}
  
    {/* Show centered unlock card if no boxes unlocked */}
    {!loading  && boxes.length > 0 &&(
    
<Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
  
  {/* ✅ Carte box déverrouillée */}
  {boxes.length > 0 && (
    <Grid item xs={12} md={8}>
      <Card sx={{
        backgroundColor: 'rgba(85, 187, 255, 0.13)',
        border: '2px solid rgba(0, 186, 210, 0.3)',
        color: '#fff',
        p: { xs: 2, sm: 2.5 },
        height: '100%',
        minHeight: '250px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 20px rgba(6,112,136,0.54)',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 16px rgba(47,47,47,0.3)' }
      }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, fontSize: { xs: '1.125rem', sm: '1.5rem' } }}>
            {boxes[0].name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#b0b0b0', fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {boxes[0].description}
          </Typography>
          <Typography variant="body2" sx={{ color: '#8062f8ff', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Progress: {boxes[0].chapters?.length || 0} chapters
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )}

  {/* ✅ Carte unlock — même container, alignée */}
  <Grid item xs={12} md={boxes.length > 0 ? 4 : 12}>
    <Card sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(30, 30, 30, 0.8)',
      color: '#fff',
      p: { xs: 2, sm: 3 },
      height: '100%',
      minHeight: '250px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 20px rgba(6,112,136,0.2)',
      borderRadius: { xs: 2, md: 3 },
      border: '2px solid rgba(0, 186, 210, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""', position: 'absolute', top: 0, left: '-100%',
        width: '100%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        transition: 'left 0.5s',
      },
      '&:hover::before': { left: '100%' }
    }}>
      <CardContent sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
        <Grid container spacing={2} alignItems="center">
          
          {/* Texte + bouton */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{
              mb: 2, fontWeight: 600, color: '#fff',
              textShadow: '0 0 10px rgba(128,98,248,0.5)',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              Ktix's Boxes
            </Typography>
            <Typography variant="body1" sx={{
              mb: 2, color: '#b0b0b0',
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              🔒 Unlock your new box
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button
                onClick={handleOpenBoxClick}
                variant="contained"
                sx={{
                  color: '#fff', fontWeight: 500,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                  padding: { xs: '8px 20px', md: '10px 20px' },
                  borderRadius: '10px',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Unlock Now
              </Button>
            </Box>
          </Grid>

          {/* Image cadenas */}
          <Grid item xs={12} md={6} sx={{
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          }}>
            <Box sx={{
              position: 'relative',
              cursor: 'pointer',
              '&:hover img': {
                transform: 'scale(1.1) rotate(5deg)',
                filter: 'drop-shadow(0 0 20px rgba(128,98,248,0.6))'
              }
            }} onClick={handleOpenBoxClick}>
              <img src="lock.png" alt="lock" style={{
                width: '100%', maxWidth: '180px', height: 'auto',
                objectFit: 'contain', display: 'block',
                filter: 'drop-shadow(0 0 15px rgba(128,98,248,0.4))',
                transition: 'all 0.3s ease',
              }} />
              <Box sx={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(128,98,248,0.2) 0%, transparent 70%)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%,100%': { opacity: 0.5, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.1)' }
                }
              }} />
            </Box>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  </Grid>

</Grid>
    
    )}
      </Container>
    </Box>
  );
};

export default UnlockedDashboard;