import * as React from 'react';
import {
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import CircularProgress from "@mui/material/CircularProgress";


export default function Header({ handleCreateProject, loadingCreate }) {
  const [open, setOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          maxWidth: { sm: '100%', md: '1700px' },
          pt: 1.0,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpen}
            style={{ backgroundColor: '#031427' }}
            sx={{
              px: 2.5,
              py: 0.8,
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(to right, #6A11CB, #2575FC)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              color: '#fff',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(to right,rgb(218, 231, 255),rgb(197, 157, 239))',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Create Project
          </Button>
        </Stack>
      </Stack>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData).entries());
              const name = formJson.name;
              const description = formJson.description;
              const response = await handleCreateProject(name, description);
              if (response.success) {
                setProjectName('');
                setDescription('');
                handleClose();
              }
            },
          },
        }}
      >
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the project details below.
          </DialogContentText>

          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="My Awesome Project"
          />

          <TextField
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="A short summary of your project..."
          />
        </DialogContent>


        <DialogActions
          sx={{
            justifyContent: 'end',
            padding: '16px',
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: '#555',
              textTransform: 'none',
              px: 2.0,
              py: 0.6,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f5f5f5',
                color: '#000',
              },
            }}
          >
            Cancel
          </Button>

          {!loadingCreate ? (
            <Button
              type="submit"
              sx={{
                background: 'linear-gradient(to right,rgb(47, 9, 87),rgb(3, 16, 38))',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 2.0,
                py: 0.6,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(to right,rgb(99, 99, 99),rgb(173, 173, 173))',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Create Project
            </Button>
          ) : (

            <Button
              type="submit"
              sx={{
                background: 'linear-gradient(to right,rgb(47, 9, 87),rgb(3, 16, 38))',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 2.0,
                py: 0.6,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(to right,rgb(99, 99, 99),rgb(173, 173, 173))',
                  transform: 'translateY(-1px)',
                },
              }}
              disabled={loadingCreate}

            >
              <CircularProgress color="light" size={24} />
            </Button>
          )}
        </DialogActions>
      </Dialog >


    </>
  );
}
