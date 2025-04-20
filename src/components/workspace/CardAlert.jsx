import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';

export default function CardAlert() {
  return (
    <Card
      variant="outlined"
      sx={{
        m: 2,
        p: 2,
        borderColor: 'primary.main',
        backgroundColor: 'background.default',
        flexShrink: 0,
        boxShadow: 4,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <RocketLaunchRoundedIcon color="primary" />
        <Typography variant="h6" sx={{ 
          fontSize: '1.0rem',
          fontWeight: 700 }}>
          Ready to launch your next project?
        </Typography>
        <Typography variant="body2" sx={{
          fontSize: '0.85rem',
          color: 'text.secondary'
        }}>
          Start a new collaborative coding session now and bring your ideas to life in real-time.
        </Typography>
      </CardContent>
    </Card>
  );
}
