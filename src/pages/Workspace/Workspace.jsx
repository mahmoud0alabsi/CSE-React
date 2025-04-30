import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppNavbar from '../../components/workspace/AppNavbar';
import MainGrid from '../../components/workspace/MainGrid';
import SideMenu from '../../components/workspace/SideMenu';
import AppTheme from '../../theme/AppTheme';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading } from '../../state_managment/store';

export default function WorkspacePage(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideLoading());
  }, [dispatch]);

  return (
    <AppTheme {...props} >
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <MainGrid />
        </Box>
      </Box>
    </AppTheme>
  );
}
