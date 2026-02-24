"use client";
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import ProfileSection from './ProfileSection.js';
import {
  Drawer, List, ListItemButton, ListItemText,
  Box, Typography, CircularProgress, IconButton,
  useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import LockIcon from '@mui/icons-material/Lock';
import FolderIcon from '@mui/icons-material/Folder';

const Sidebar = ({ onSelect, selectedBoxId, onLogout, showEmptyState = false }) => {
  const [loading, setLoading] = useState(true);
  const [unlockedBoxes, setUnlockedBoxes] = useState([]);
  const [boxData, setBoxData] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

const assemblySteps = boxData?.steps?.map(step => ({
  id: step.stepNumber,
  name: step.title,
  stepNumber: step.stepNumber,
})) || [];


  const fetchUserBoxes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/boxes/my-boxes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUnlockedBoxes(data);
      }
    } catch (error) {
      console.error('Error fetching boxes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBoxContent = async (boxId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/boxes/${boxId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBoxData(data);
      }
    } catch (error) {
      console.error('Error loading box content:', error);
    }
  };

  useEffect(() => {
    fetchUserBoxes();
  }, []);

  // Load box content once we have unlocked boxes
  useEffect(() => {
    if (unlockedBoxes.length > 0) {
      loadBoxContent(unlockedBoxes[0].boxId);
    }
  }, [unlockedBoxes]);

  const handleStepClick = (step) => {
    setSelectedStep(step.id);
    if (onSelect) onSelect(step);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
 <Box sx={{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: { xs: 280, sm: 300, md: 250 },
  p: { xs: 1.5, md: 2 },
  backgroundColor: '#282733',
  height: '100vh',
  borderTopLeftRadius: { xs: 0, md: 20 },
  borderBottomLeftRadius: { xs: 0, md: 20 },
  overflow: 'auto',
  // ✅ Replace the white scrollbar
  '&::-webkit-scrollbar': { width: 4 },
  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(128, 98, 248, 0.4)',
    borderRadius: 3,
    '&:hover': { backgroundColor: 'rgba(128, 98, 248, 0.7)' }
  },
  // ✅ Firefox
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(128, 98, 248, 0.4) transparent',
}}>
      <Box>
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <img src="/KTIX.png" alt="Logo" style={{ width: '100%', maxWidth: '150px', height: 'auto' }} />
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* My Boxes */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{
            textAlign: 'center', mb: 2,
            fontSize: { xs: '1rem', md: '1.125rem' },
            fontWeight: 500, color: '#ffffff'
          }}>
            My Boxes
          </Typography>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={30} sx={{ color: '#58c3d1' }} />
            </Box>
          )}

          {/* Show empty state if showEmptyState is true OR (no boxes and not loading) */}
          {(showEmptyState || (!loading && unlockedBoxes.length === 0)) && (
            <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
              <LockIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                No boxes unlocked yet
              </Typography>
            </Box>
          )}

          {/* No steps loaded yet - only show if NOT in empty state mode */}
          {!showEmptyState && !loading && unlockedBoxes.length > 0 && !boxData && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={30} sx={{ color: '#58c3d1' }} />
            </Box>
          )}

          {/* Steps list - only show if NOT in empty state mode */}
{!showEmptyState && !loading && boxData && assemblySteps.length > 0 && (
  <List component="div" sx={{ color: '#ffffff' }}>
    <Typography sx={{
      top: 0, backgroundColor: '#282733', zIndex: 1,
      py: 1, textAlign: 'center',
      fontWeight: 600, color: '#58c3d1', mb: 1
    }}>
      <FolderIcon sx={{ mr: 1, fontSize: { xs: 16, md: 18 }, color: '#58c3d1' }} />
      {boxData.title}
    </Typography>

    {assemblySteps.map((step) => (
      <ListItemButton
        key={step.id}
        onClick={() => handleStepClick(step)} // ✅ passes full step object
        sx={{
          pl: { xs: 2, md: 3 },
          py: { xs: 0.75, md: 1 },
          borderRadius: 1, mb: 0.5,
          backgroundColor: selectedStep === step.id ? 'rgba(128, 98, 248, 0.15)' : 'transparent',
          borderLeft: selectedStep === step.id ? '3px solid #8062f8ff' : '3px solid transparent',
          '&:hover': { backgroundColor: 'rgba(128, 98, 248, 0.1)' }
        }}
      >
        <DescriptionIcon sx={{ mr: { xs: 1.5, md: 2 }, fontSize: { xs: 16, md: 18 }, color: '#005763' }} />
        <ListItemText
          primary={`${step.stepNumber}. ${step.name}`}
          primaryTypographyProps={{
            fontSize: { xs: 13, md: 14 },
            fontWeight: selectedStep === step.id ? 600 : 'normal',
            color: '#fff'
          }}
        />
      </ListItemButton>
    ))}
  </List>
)}
        </Box>
      </Box>

      {/* Bottom - Profile */}
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <ProfileSection onLogout={onLogout} />
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed', top: 16, left: 16, zIndex: 1300,
            backgroundColor: '#282733', color: '#fff',
            '&:hover': { backgroundColor: '#3a3848' }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Drawer variant="permanent" sx={{
          width: 250, flexShrink: 0,
          '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', border: 'none', backgroundColor: 'transparent' },
        }}>
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary" anchor="left"
          open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', border: 'none', backgroundColor: 'transparent' } }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;