import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  AppBar,
  Button,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./HamburgerMenu.module.css";
import { useNavigate } from "react-router-dom";

const menuItems = ["Dashboard", "Employees", "Settings"];
const centerItems = ["Home", "Employees", "Reports"];

const HamburgerMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    console.log(`Clicked on ${item}`);
    setOpen(false);
  };

  const handleSignOut = () => {
    localStorage.clear(); // clear token and role
    navigate("/login"); // navigate to login page
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Box className={styles.left}>
            <IconButton
              onClick={() => setOpen(true)}
              edge="start"
              color="inherit"
              aria-label="open menu"
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={styles.title}>
              My App
            </Typography>
          </Box>

          <Box className={styles.center}>
            {centerItems.map((item) => (
              <Button key={item} color="inherit" className={styles.button}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        classes={{ paper: styles.drawerPaper }}
      >
        <Box className={styles.drawerHeader}>
          <Typography variant="h6">Menu</Typography>
        </Box>

        <List>
          {menuItems.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleItemClick(text)}>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}

          <Divider />

          {/* Sign Out button */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
