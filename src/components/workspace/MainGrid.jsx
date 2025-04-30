import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from './Copyright';
import ProjectCard from './ProjectCard';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Header from './Header';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

import { useEffect, useState } from 'react';
import { handleGetAllProjects, handleCreateProject, handleDeleteProject } from '../../api/project/handlers';


export default function MainGrid() {
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [ownerProjects, setOwnerProjects] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await handleGetAllProjects();
        if (response.success) {
          const owner = [];
          const team = [];

          response.data.forEach((project) => {
            if (project.role === 'OWNER') {
              owner.push(project);
            } else {
              team.push(project);
            }
          });

          setOwnerProjects(owner);
          setTeamProjects(team);
        } else {
          console.error(response.message);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateNewProject = async (name, description) => {
    setLoadingCreate(true);
    const response = await handleCreateProject({ name, description });

    if (response.success) {
      const newProject = {
        id: response.message.id,
        name: response.message.name,
        ownerName: response.message.ownerName,
        description: response.message.description || '',
        createdAt: response.message.createdAt,
        updatedAt: response.message.updatedAt,
        role: 'OWNER',
      };
      setOwnerProjects((prevProjects) => [...prevProjects, newProject]);

      setSnackbarMessage('Project created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      console.error(response.message);
      setSnackbarMessage(response.message || 'Failed to create project.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    setLoadingCreate(false);
    return response;
  };

  const handleDeleteProj = async (projectId) => {
    setLoadingProjects(true);
    const response = await handleDeleteProject(projectId);

    if (response.success) {
      setOwnerProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
      setSnackbarMessage('Project deleted successfully!');
      setSnackbarSeverity('success');
    } else {
      console.error(response.message);
      setSnackbarMessage(response.message || 'Failed to delete project.');
      setSnackbarSeverity('error');
    }

    setSnackbarOpen(true);
    setLoadingProjects(false);
  }

  const handleSnackabrClose = () => {
    setSnackbarOpen(false);
  }

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: 'center',
        mx: 3,
        pb: 5,
        mt: { xs: 8, md: 0 },
      }}
    >
      <Header handleCreateProject={handleCreateNewProject} loadingCreate={loadingCreate} />
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>

        <Typography component="h6" variant="subtitle1" sx={{ mb: 1 }}>
          My Projects
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {loadingProjects ? (
          <Grid
            container
            spacing={2}
            sx={{
              mb: (theme) => theme.spacing(2),
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 2,
              gridAutoRows: 'minmax(100px, auto)',
              gridAutoFlow: 'dense',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex' }}>
                <Skeleton animation="wave" variant="rounded" width={350} height={200} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {
              ownerProjects.length === 0 ? (
                <Typography variant="body2" color="text.secondary"
                  sx={{
                    mb: (theme) => theme.spacing(2),
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '100%',
                  }}>
                  No projects available.
                </Typography>
              ) : (
                <Grid
                  container
                  spacing={2}
                  sx={{
                    mb: (theme) => theme.spacing(2),
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: 2,
                    gridAutoRows: 'minmax(100px, auto)',
                    gridAutoFlow: 'dense',
                  }}
                >
                  {ownerProjects
                    .map((project, index) => (
                      <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex' }}>
                        <ProjectCard
                          projectId={project.id}
                          name={project.name}
                          ownerName={project.ownerName}
                          role={project.role}
                          description={project.description}
                          createdAt={project.createdAt}
                          updatedAt={project.updatedAt}
                          onDeleteProject={handleDeleteProj}
                        />
                      </Grid>
                    ))}
                </Grid>
              )
            }
          </>
        )}

        <Typography component="h6" variant="subtitle1" sx={{ mb: 1 }}>
          Teams Projects
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {loadingProjects ? (
          <Grid
            container
            spacing={2}
            sx={{
              mb: (theme) => theme.spacing(2),
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 2,
              gridAutoRows: 'minmax(100px, auto)',
              gridAutoFlow: 'dense',
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex' }}>
                <Skeleton animation="wave" variant="rounded" width={350} height={200} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {
              teamProjects.length === 0 ? (
                <Typography variant="body2" color="text.secondary"
                  sx={{
                    mb: (theme) => theme.spacing(2),
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '100%',
                  }}>
                  No team projects available.
                </Typography>
              ) : (
                <Grid
                  container
                  spacing={2}
                  sx={{
                    mb: (theme) => theme.spacing(2),
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: 2,
                    gridAutoRows: 'minmax(100px, auto)',
                    gridAutoFlow: 'dense',
                  }}
                >
                  {teamProjects
                    .map((project, index) => (
                      <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex' }}>
                        <ProjectCard
                          projectId={project.id}
                          name={project.name}
                          ownerName={project.ownerName}
                          role={project.role}
                          description={project.description}
                          createdAt={project.createdAt}
                          updatedAt={project.updatedAt}
                          onDeleteProject={handleDeleteProj}
                        />
                      </Grid>
                    ))}
                </Grid>
              )
            }
          </>
        )}

        <Copyright sx={{ my: 4 }} />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackabrClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Stack >
  );
}
