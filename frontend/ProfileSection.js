'use client';
import React, { useState, useEffect } from "react";
import {
  Box, Avatar, Typography, ListItemButton, ListItemText,
  Popper, Fade, Paper, Divider, IconButton
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

// ─── ProfileSection component  ─────────────────
// Props:
//   onLogout: () => void   — called when user clicks Logout

const ProfileSection = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ userName: 'User', email: '' });

  // Read user info from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
  }, []);

  const open = Boolean(anchorEl);

  const handleProfileClick = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    handleClose();
    if (onLogout) onLogout();
  };

  // Initials for avatar
  const initials = user.userName
    ? user.userName.slice(0, 2).toUpperCase()
    : 'U';

  return (
    <Box sx={{ mt: 'auto', pt: 2 }}>

      {/* Profile Button */}
      <ListItemButton
        onClick={handleProfileClick}
        sx={{
          borderRadius: 2,
          mb: 2,
          py: { xs: 1, md: 1.5 },
          backgroundColor: open
            ? 'rgba(128, 98, 248, 0.2)'
            : 'rgba(128, 98, 248, 0.05)',
          border: open
            ? '1px solid rgba(128, 98, 248, 0.5)'
            : '1px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(128, 98, 248, 0.15)',
          }
        }}
      >
        <Avatar
          sx={{
            width: { xs: 28, md: 32 },
            height: { xs: 28, md: 32 },
            mr: 1.5,
            bgcolor: 'linear-gradient(135deg, #8062f8, #58c3d1)',
            background: 'linear-gradient(135deg, #8062f8 0%, #58c3d1 100%)',
            fontSize: { xs: 11, md: 13 },
            fontWeight: 700,
            boxShadow: open ? '0 0 12px rgba(128, 98, 248, 0.6)' : 'none',
            transition: 'box-shadow 0.2s ease',
          }}
        >
          {initials}
        </Avatar>
        <ListItemText
          primary={user.userName || 'Profile'}
          primaryTypographyProps={{
            color: '#ffffff',
            fontSize: { xs: 13, md: 14 },
            fontWeight: 500,
            noWrap: true,
          }}
        />
      </ListItemButton>

      {/* Profile Card Popper */}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="top-start"
        transition
        style={{ zIndex: 1300 }}
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={0}
              sx={{
                width: 260,
                backgroundColor: 'rgba(18, 18, 35, 0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(128, 98, 248, 0.3)',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(128,98,248,0.1)',
              }}
            >
              {/* Card Header */}
              <Box sx={{
                p: 2.5,
                pb: 2,
                background: 'linear-gradient(135deg, rgba(128,98,248,0.15) 0%, rgba(88,195,209,0.08) 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                position: 'relative',
              }}>
                <IconButton
                  onClick={handleClose}
                  size="small"
                  sx={{
                    position: 'absolute', top: 8, right: 8,
                    color: 'rgba(255,255,255,0.3)',
                    p: 0.5,
                    '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>

                {/* Avatar + name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{
                    width: 48, height: 48,
                    background: 'linear-gradient(135deg, #8062f8 0%, #58c3d1 100%)',
                    fontSize: 18, fontWeight: 700,
                    boxShadow: '0 4px 16px rgba(128,98,248,0.4)',
                  }}>
                    {initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{
                      color: '#fff', fontWeight: 700,
                      fontSize: '0.95rem', lineHeight: 1.2
                    }}>
                      {user.userName}
                    </Typography>
                    <Box sx={{
                      display: 'inline-block', mt: 0.5,
                      px: 1, py: 0.2, borderRadius: '20px',
                      backgroundColor: 'rgba(88,195,209,0.15)',
                      border: '1px solid rgba(88,195,209,0.3)',
                    }}>
                      <Typography sx={{ color: '#58c3d1', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>
                        MEMBER
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 2 }}>
                {/* Email row */}
                {user.email && (
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: 1.5, borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    mb: 1.5,
                  }}>
                    <EmailIcon sx={{ color: '#58c3d1', fontSize: 16 }} />
                    <Typography sx={{
                      color: '#9090b0', fontSize: '0.8rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {user.email}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 1.5 }} />

                {/* Logout Button */}
                <Box
                  onClick={handleLogout}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: 1.5, borderRadius: 2, cursor: 'pointer',
                    border: '1px solid rgba(255, 90, 90, 0.2)',
                    backgroundColor: 'rgba(255, 90, 90, 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 90, 90, 0.15)',
                      border: '1px solid rgba(255, 90, 90, 0.4)',
                      transform: 'translateX(2px)',
                    }
                  }}
                >
                  <LogoutIcon sx={{ color: '#ff6b6b', fontSize: 18 }} />
                  <Typography sx={{ color: '#ff6b6b', fontSize: '0.875rem', fontWeight: 600 }}>
                    Log out
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Copyright */}
      <Typography sx={{
        fontSize: { xs: 9, md: 10 },
        textAlign: 'center',
        color: '#555468',
        px: 1
      }}>
        © {new Date().getFullYear()} KTIX Labs. All rights reserved.
      </Typography>
    </Box>
  );
};

export default ProfileSection;