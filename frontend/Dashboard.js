'use client';
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { 
  Container,
  CardContent,
  Card,
  Typography,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Paper
} from "@mui/material";
import { useForm } from "react-hook-form";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IoDocumentTextOutline } from "react-icons/io5";
import ClickAwayListener from '@mui/material/ClickAwayListener';
const Dashboard = (onLogout) => {
  const [boxes, setBoxes] = useState([]);     
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [unlockedBoxes, setUnlockedBoxes] = useState([]); // Track unlocked boxes
  const [assemblyMode, setAssemblyMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
const [openTheorie, setOpenTheorie] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // Code statique pour déverrouiller/ statique assemblySteps steps
  const UNLOCK_CODE = "salemktix1";
  
    // Assembly steps (images des pièces du robot)
  const assemblySteps = [
    {
      id: 1,
      name: 'Base',
      image: '/assemblySteps/base.jpg', 
      description: 'Robot base plate'
    },
    {
      id: 2,
      name: 'Motor',
      image: '/assemblySteps/motor.jpg',
      description: 'Main motor component'
    },
    {
      id: 3,
      name: 'Arm',
      image: '/assemblySteps/arm.jpg',
      description: 'Robot arm assembly'
    },
    {
      id: 4,
      name: 'disque',
      image: '/assemblySteps/disque.webp',
      description: 'End effector gripper'
    }
  ];
  useEffect(() => {
    fetchBoxes();
  }, []);

  const handleOpenBoxClick = () => {
    setOpenDialog(true);
    reset();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };
  
  const fetchBoxes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/boxes');
      const data = await response.json();
      setBoxes(data);
    } catch (error) {
      console.error('Error fetching boxes:', error);
      // Données de démonstration
      setBoxes([
        {
          id: '1',
          name: 'KTIX Industrial Robot',
          description: 'Learn industrial robotics and automation',
          isLocked: true,
          chapters: [
            { id: '1-1', title: 'Chapter 1: Introduction to Robotics',substep:[] },
            { id: '1-2', title: 'Chapter 2: Robot Components' },
            { id: '1-3', title: 'Chapter 3: Programming Basics' },
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCode = async (data) => {
    // Vérifier le code statique
    if (data.boxCode.trim() === UNLOCK_CODE) {
      // Code correct - Succès
      setAlertType('success');
      setAlertMessage('🎉 Félicitations! Box déverrouillée avec succès!');
      setShowAlert(true);
      handleCloseDialog();
      
      // Déverrouiller la box (marquer comme unlocked)
      const boxToUnlock = boxes.find(box => box.isLocked);
      if (boxToUnlock) {
        setUnlockedBoxes(prev => [...prev, boxToUnlock.id]);
        setSelectedBoxId(boxToUnlock.id);
        
        // Mettre à jour l'état de la box
        setBoxes(prevBoxes => 
          prevBoxes.map(box => 
            box.id === boxToUnlock.id 
              ? { ...box, isLocked: false } 
              : box
          )
        );
      }
    } else {
      // Code incorrect
      setAlertType('error');
      setAlertMessage('❌ Code incorrect. Veuillez réessayer.');
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleStartAssembly = () => {
  setAssemblyMode(true);
  setCurrentStepIndex(0);
  };
    const handleExitAssembly = () => {
    setAssemblyMode(false);
    setCurrentStepIndex(0);
  }; 
    const handleStepClick = (index) => {
    setCurrentStepIndex(index);
  };

  const handlePreviousStep = () => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setCurrentStepIndex(prev => Math.min(assemblySteps.length - 1, prev + 1));
  };
  const handleOpenTheorie = (e) => {
    e.stopPropagation();
    setOpenTheorie(true);
  }
  const handleCloseTheorie = () => {
   
    setOpenTheorie(false);

  
  }


// Theoretical content for each step
const theoryContent = {
  
  "boxes": [
    {
      "id": 1,
      "name": "Robot Arm Assembly",
      "isLocked": false,
      "chapters": [
        {
          "id": 11,
          "title": "Base Structure Assembly",
          "steps": [
            {
              "id": 111,
              "title": "Install Base Plate",
              "substeps": [
                {
                  "id": 1111,
                  "title": "Position Base Plate",
                  "images": ['/assemblySteps/base.jpg'],
                  "explication": "Align the base plate with mounting holes."
                },
                {
                  "id": 1112,
                  "title": "Tighten Screws",
                  "images": ['/assemblySteps/base.jpg'],
                  "explication": "Secure using M6 screws with torque wrench."
                }
              ],
              "theoreticalFoundation": {
                "title": "Mechanical Stability",
                "text": "Stable mounting reduces vibration and improves precision.",
                "image": "stability.png",
                "formulat": "F = m * a"
              }
            },
            {
              "id": 112,
              "title": "Mount Rotation Motor",
              "substeps": [
                {
                  "id": 1121,
                  "title": "Attach Motor Bracket",
                  "images": ['/assemblySteps/motor.jpg'],
                  "explication": "Fix the motor bracket to the base."
                },
                {
                  "id": 1122,
                  "title": "Connect Motor Shaft",
                  "images": ['/assemblySteps/motor.jpg'],
                  "explication": "Ensure alignment with central axis."
                }
              ],
              "theoreticalFoundation": {
                "title": "Torque Transmission",
                "text": "Torque is transferred through rotational shafts.",
                "image": "torque.png",
                "formulat": "T = F * r"
              }
            }
          ]
        },
        {
          "id": 12,
          "title": "Arm Segment Assembly",
          "steps": [
            {
              "id": 121,
              "title": "Install Lower Arm",
              "substeps": [
                {
                  "id": 1211,
                  "title": "Insert Bearings",
                  "images": ['/assemblySteps/arm.jpg'],
                  "explication": "Place bearings inside arm joint."
                },
                {
                  "id": 1212,
                  "title": "Attach Arm Frame",
                  "images": ['/assemblySteps/arm.jpg'],
                  "explication": "Fix frame with 4 bolts."
                }
              ],
              "theoreticalFoundation": {
                "title": "Load Distribution",
                "text": "Even distribution increases lifespan of joints.",
                "image": "load.png",
                "formulat": "Stress = Force / Area"
              }
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "Mobile Robot Base",
      "isLocked": true,
      "chapters": [
        {
          "id": 21,
          "title": "Wheel System",
          "steps": [
            {
              "id": 211,
              "title": "Install Wheels",
              "substeps": [
                {
                  "id": 2111,
                  "title": "Attach Wheel Axle",
                  "images": ['/assemblySteps/disque.jpg'],
                  "explication": "Insert axle into chassis slots."
                },
                {
                  "id": 2112,
                  "title": "Fix Wheels",
                  "images": ['/assemblySteps/disque.jpg'],
                  "explication": "Lock wheels using safety nuts."
                }
              ],
              "theoreticalFoundation": {
                "title": "Friction and Motion",
                "text": "Friction controls acceleration and braking.",
                "image": "friction.png",
                "formulat": "F = μN"
              }
            }
          ]
        },
        {
          "id": 22,
          "title": "Control Electronics",
          "steps": [
            {
              "id": 221,
              "title": "Install Microcontroller",
              "substeps": [
                {
                  "id": 2211,
                  "title": "Place Controller Board",
                  "images": ['/assemblySteps/base.jpg'],
                  "explication": "Mount board on insulated supports."
                },
                {
                  "id": 2212,
                  "title": "Connect Power Supply",
                  "images": ['/assemblySteps/base.jpg'],
                  "explication": "Ensure correct polarity."
                }
              ],
              "theoreticalFoundation": {
                "title": "Voltage Regulation",
                "text": "Stable voltage ensures reliable electronics.",
                "image": "voltage.png",
                "formulat": "V = I * R"
              }
            }
          ]
        }
      ]
    }
  ]
}

  // Check if any box is unlocked
  const hasUnlockedBox = boxes.some(box => !box.isLocked);
if (assemblyMode) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidebar onLogout={onLogout} selectedBoxId={selectedBoxId} unlockedBoxes={unlockedBoxes} />
      
      {/* Main Assembly Area */}
      <Box sx={{ 
        flex: 1,
        width: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1a1a2e',
        overflow: 'hidden',
        position: 'relative' // CRITICAL for theory panel positioning
      }}>
        
        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 10,
          flexShrink: 0
        }}>
          <IconButton 
              onClick={handleExitAssembly}
              sx={{
                color: '#fff',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.4)' }
              }}>
           <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
            Assembly Mode
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              onClick={handleOpenTheorie}
              sx={{ 
                background: 'linear-gradient(135deg, #080c8d 0%, #0891b2 100%)',
                color: '#fff',
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 1.5 },
                borderRadius: '10px',
                fontSize: { xs: '0.875rem', md: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(107, 255, 250, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5900f4 0%, #18afd5 100%)',
                  boxShadow: '0 6px 20px rgba(130, 253, 253, 0.72)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              THEORY <IoDocumentTextOutline size={20} />
            </Button>
          </Box>
        </Box>

        {/* Content Area: Image + Theory Panel side by side */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          position: 'relative'
        }}>

          {/* Image Section */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s ease'
          }}>
            {/* Left Arrow */}
            <IconButton
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
              sx={{
                position: 'absolute',
                left: 20,
                zIndex: 10,
                backgroundColor: 'rgba(128, 98, 248, 0.2)',
                color: '#fff',
                width: 50,
                height: 50,
                '&:hover': { backgroundColor: 'rgba(128, 98, 248, 0.5)' },
                '&.Mui-disabled': { opacity: 0.2 }
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            {/* Center Image Content */}
            <Box sx={{
              textAlign: 'center',
              px: { xs: 8, md: 10 },
              animation: 'fadeIn 0.3s ease-in',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'scale(0.95)' },
                to: { opacity: 1, transform: 'scale(1)' }
              }
            }}>
              <Box
                component="img"
                src={assemblySteps[currentStepIndex].image}
                alt={assemblySteps[currentStepIndex].name}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '50vh',
                  objectFit: 'contain',
                 // filter: 'drop-shadow(0 0 30px rgba(128, 98, 248, 0.5))',
                  transition: 'all 0.3s ease',
                }}
                onError={(e) => { e.target.src = '/lock.png'; }}
              />

              <Typography 
                variant="h4" 
                sx={{ 
                  mt: 2,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                {assemblySteps[currentStepIndex].name}
              </Typography>

              <Typography variant="body1" sx={{ mt: 1, color: '#b0b0b0' }}>
                {assemblySteps[currentStepIndex].description}
              </Typography>

              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1,
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontStyle: 'italic'
                }}
              >
                Step {currentStepIndex + 1} of {assemblySteps.length}
              </Typography>
            </Box>

            {/* Right Arrow */}
            <IconButton
              onClick={handleNextStep}
              disabled={currentStepIndex === assemblySteps.length - 1}
              sx={{
                position: 'absolute',
                right: 20,
                zIndex: 10,
                backgroundColor: 'rgba(128, 98, 248, 0.2)',
                color: '#fff',
                width: 50,
                height: 50,
                '&:hover': { backgroundColor: 'rgba(128, 98, 248, 0.5)' },
                '&.Mui-disabled': { opacity: 0.2 }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          {/* Theory Panel - RIGHT 1/3 */}
          {openTheorie && (
            <ClickAwayListener onClickAway={handleCloseTheorie}>
              <Box sx={{
                width: { xs: '100%', md: '33%' },
                height: '100%',
                backgroundColor: 'rgba(15, 15, 35, 0.98)',
                backdropFilter: 'blur(20px)',
                borderLeft: '2px solid rgba(128, 98, 248, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                position: { xs: 'absolute', md: 'relative' },
                right: 0,
                top: 0,
                zIndex: { xs: 20, md: 'auto' },
                overflowY: 'auto',
                flexShrink: 0,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(128, 98, 248, 0.5)',
                  borderRadius: 3
                }
              }}>
                {/* Theory Header - Sticky */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2.5,
                  borderBottom: '1px solid rgba(128, 98, 248, 0.3)',
                  background: 'linear-gradient(135deg, rgba(8, 12, 141, 0.5) 0%, rgba(8, 145, 178, 0.3) 100%)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                }}>
                  <Typography sx={{ 
                    color: '#fff', 
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}>
                    📄 {theoryContent[currentStepIndex]?.title || 'Theory'}
                  </Typography>
                  <IconButton 
                    onClick={handleCloseTheorie}
                    sx={{ 
                      color: '#fff', 
                      p: 0.5,
                      '&:hover': { color: '#ff6b6b' }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Difficulty Badge */}
                <Box sx={{ px: 2.5, pt: 2 }}>
                  <Box sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 0.5,
                    borderRadius: '20px',
                    backgroundColor: 
                      theoryContent[currentStepIndex]?.difficulty === 'Beginner' 
                        ? 'rgba(76, 175, 80, 0.2)' 
                        : theoryContent[currentStepIndex]?.difficulty === 'Intermediate'
                          ? 'rgba(255, 165, 0, 0.2)'
                          : 'rgba(255, 107, 107, 0.2)',
                    border: '1px solid',
                    borderColor:
                      theoryContent[currentStepIndex]?.difficulty === 'Beginner' 
                        ? 'rgba(76, 175, 80, 0.5)' 
                        : theoryContent[currentStepIndex]?.difficulty === 'Intermediate'
                          ? 'rgba(255, 165, 0, 0.5)'
                          : 'rgba(255, 107, 107, 0.5)',
                  }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>
                      {theoryContent[currentStepIndex]?.difficulty === 'Beginner' ? '🟢' : 
                       theoryContent[currentStepIndex]?.difficulty === 'Intermediate' ? '🟡' : '🔴'}{' '}
                      {theoryContent[currentStepIndex]?.difficulty}
                    </Typography>
                  </Box>
                </Box>

                {/* Theory Content Sections */}
                <Box sx={{ p: 2.5 }}>
                  {theoryContent[currentStepIndex]?.content.map((section, idx) => (
                    <Box 
                      key={idx}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        '&:hover': {
                          backgroundColor: 'rgba(128, 98, 248, 0.05)',
                          border: '1px solid rgba(128, 98, 248, 0.2)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Typography sx={{ 
                        color: '#58c3d1', 
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        mb: 1
                      }}>
                        {section.subtitle}
                      </Typography>
                      <Typography sx={{ 
                        color: '#b0b0b0', 
                        fontSize: '0.875rem',
                        lineHeight: 1.7
                      }}>
                        {section.text}
                      </Typography>
                    </Box>
                  ))}

                  {/* Formula Box */}
                  {theoryContent[currentStepIndex]?.formula && (
                    <Box sx={{
                      mt: 2,
                      p: 2.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(8, 12, 141, 0.3) 0%, rgba(8, 145, 178, 0.2) 100%)',
                      border: '1px solid rgba(88, 195, 209, 0.3)',
                      textAlign: 'center'
                    }}>
                      <Typography sx={{ 
                        color: '#888', 
                        fontSize: '0.7rem',
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}>
                        Key Formulas
                      </Typography>
                      <Typography sx={{ 
                        color: '#58c3d1',
                        fontFamily: 'monospace',
                        fontSize: '1rem',
                        fontWeight: 700,
                        letterSpacing: 1
                      }}>
                        {theoryContent[currentStepIndex].formula}
                      </Typography>
                    </Box>
                  )}

                  {/* Fallback */}
                  {!theoryContent[currentStepIndex] && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: '#888', fontStyle: 'italic' }}>
                        No theory available for this step yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </ClickAwayListener>
          )}
        </Box>

        {/* Bottom Steps Bar */}
        <Paper sx={{
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '2px solid rgba(128, 98, 248, 0.3)',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          overflowX: 'auto',
          flexShrink: 0,
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(128, 98, 248, 0.5)',
            borderRadius: 3,
          }
        }}>
          {assemblySteps.map((step, index) => (
            <Box
              key={step.id}
              onClick={() => handleStepClick(index)}
              sx={{
                cursor: 'pointer',
                padding: 1,
                borderRadius: 2,
                border: currentStepIndex === index 
                  ? '3px solid #8062f8ff' 
                  : '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: currentStepIndex === index 
                  ? 'rgba(128, 98, 248, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                minWidth: { xs: '70px', sm: '90px' },
                textAlign: 'center',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(128, 98, 248, 0.4)',
                  borderColor: '#8062f8ff'
                }
              }}
             >
              <Box
                component="img"
                src={step.image}
                alt={step.name}
                sx={{
                  width: { xs: '100px', sm: '100px' },
                  height: { xs: '45px', sm: '45px' },
                  objectFit: 'contain',
                  filter: currentStepIndex === index 
                    ? 'none' 
                    : 'grayscale(50%) opacity(0.7)',
                  transition: 'filter 0.3s ease'
                }}
                onError={(e) => { e.target.src = '/lock.png'; }}/>
                
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mt: 0.5,
                  color: currentStepIndex === index ? '#fff' : '#888',
                  fontWeight: currentStepIndex === index ? 600 : 400,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' }
                }}
              >
                {step.name}
              </Typography>
            
            </Box>
          ))}
          <Box>
        </Box>
                   
        </Paper>
        <Box sx={{ display: 'flex',
          backgroundColor:'rgba(30, 30, 30, 0.95)',
          }}>
         <Typography variant="explication" 
         sx={{display:'flex',
          color:'#fff',
          fontSize:'0.9rem',
           p:1}}> No theory available for this step yet
</Typography></Box>
      </Box>
    </Box>
  );
}
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <Sidebar selectedBoxId={selectedBoxId} unlockedBoxes={unlockedBoxes} />
      
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
          {hasUnlockedBox && (
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartAssembly}
              sx={{
                    background: 'linear-gradient(135deg, #080c8d 0%, #0891b2 100%)',
                color: '#fff',
                mt:'41px',
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
          )}
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
            🔓 Déverrouiller une Box
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
                Entrez le code de déverrouillage pour accéder à votre nouvelle box
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
                Annuler
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
                Déverrouiller
              </Button>
            </DialogActions>
          </form>
        </Dialog>
{/* Cards Grid - Centered layout */}
{loading ? (    
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
    <CircularProgress size={30} />
  </Box>
) : (
  <>
    {/* Show centered unlock card if no boxes unlocked */}
    {boxes.filter(box => !box.isLocked).length === 0 && (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        width: '100%',
      }}>
        <Card sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
          color: '#fff',
          p: { xs: 2, sm: 3 },
          maxWidth: '900px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(6, 112, 136, 0.2)',
          borderRadius: { xs: 2, md: 3 },
          border: '2px solid rgba(0, 186, 210, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          }
        }}>
          <CardContent sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    color: '#fff',
                    textShadow: '0 0 10px rgba(128, 98, 248, 0.5)',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Ktix's Boxes
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3, 
                    color: '#b0b0b0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  🔒 Unlock your first box
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', md: 'flex-start' } 
                }}>
                  <Button
                    onClick={handleOpenBoxClick}
                    variant="contained"
                    sx={{ 
                      color: '#fff',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                      padding: { xs: '10px 24px', sm: '12px 32px' },
                      borderRadius: '12px',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(128, 98, 248, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                        boxShadow: '0 6px 20px rgba(128, 98, 248, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Unlock Now
                  </Button>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }} sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mt: { xs: 3, md: 0 }
              }}>
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover img': {
                    transform: 'scale(1.1) rotate(5deg)',
                    filter: 'drop-shadow(0 0 20px rgba(128, 98, 248, 0.6))'
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
                      filter: 'drop-shadow(0 0 15px rgba(128, 98, 248, 0.4))',
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    width: { xs: '200px', sm: '240px' },
                    height: { xs: '200px', sm: '240px' },
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(128, 98, 248, 0.2) 0%, transparent 70%)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        opacity: 0.5,
                        transform: 'scale(1)',
                      },
                      '50%': {
                        opacity: 1,
                        transform: 'scale(1.1)',
                      }
                    }
                  }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    )}

    {/* Show grid layout if boxes are unlocked */}
    {boxes.filter(box => !box.isLocked).length > 0 && (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Unlocked Box Cards */}
        {boxes.filter(box => !box.isLocked).map((box) => (
          <Grid size={{ xs: 12, sm: 6, md: 8, lg: 8 }} key={box.id}>
            <Card 
              sx={{
                backgroundColor: 'rgba(85, 187, 255, 0.13)', 
                border: '2px solid rgba(0, 186, 210, 0.3)',
                color: '#fff', 
                p: { xs: 2, sm: 2.5 },
                height: '100%',
                minHeight: '250px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(6, 112, 136, 0.54)',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(47, 47, 47, 0.3)'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                  }}
                >
                  {box.name}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 2, 
                    color: '#b0b0b0',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {box.description}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#8062f8ff',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  Progress: {box.chapters?.length || 0} chapters
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Unlock New Box Card - Smaller card in grid */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(6, 112, 136, 0.2)',
            borderRadius: { xs: 2, md: 3 },
            border: '2px solid rgba(0, 186, 210, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              transition: 'left 0.5s',
            },
            '&:hover::before': {
              left: '100%',
            }
          }}>
            <CardContent sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
              <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: '#fff',
                      textShadow: '0 0 10px rgba(128, 98, 248, 0.5)',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    Ktix's Boxes
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2, 
                      color: '#b0b0b0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    🔒 Unlock your new box
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: { xs: 'center', md: 'flex-start' } 
                  }}>
                    <Button
                      onClick={handleOpenBoxClick}
                      variant="contained"
                      sx={{ 
                        color: '#fff',
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                        padding: { xs: '8px 20px',md: '10px 20px' },
                        borderRadius: '10px',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(128, 98, 248, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                          boxShadow: '0 6px 20px rgba(128, 98, 248, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Unlock Now
                    </Button>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 6 }} sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: { xs: 2, md: 0 }
                }}>
                  <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover img': {
                      transform: 'scale(1.1) rotate(5deg)',
                      filter: 'drop-shadow(0 0 20px rgba(128, 98, 248, 0.6))'
                    }
                  }}
                  onClick={handleOpenBoxClick}
                  >
                    <img 
                      src="lock.png" 
                      alt="lock" 
                      style={{
                        width: '100%',
                        maxWidth: '180px',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 0 15px rgba(128, 98, 248, 0.4))',
                        transition: 'all 0.3s ease',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      width: { xs: '160px', sm: '200px' },
                      height: { xs: '160px', sm: '200px' },
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(128, 98, 248, 0.2) 0%, transparent 70%)',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          opacity: 0.5,
                          transform: 'scale(1)',
                        },
                        '50%': {
                          opacity: 1,
                          transform: 'scale(1.1)',
                        }
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
  </>
)}

{/* Empty State - Not needed anymore since we show centered card */}

{/* Empty State */}
{!loading && boxes.filter(box => !box.isLocked).length === 0 && (
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
)}
      </Container>
    </Box>
  );
};
export default Dashboard ;