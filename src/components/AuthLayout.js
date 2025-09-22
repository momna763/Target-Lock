import React from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';

const AuthLayout = ({ children }) => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 3
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Target Lock
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
            AI Product Hunter
          </Typography>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthLayout;
