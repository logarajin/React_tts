import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

export default function MenuBar({ onSelect }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // safe callback
  const safeOnSelect = typeof onSelect === "function" ? onSelect : () => {};

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // ❌ remove any onSelect call here
  };

  const handleOptionClick = (option) => {
    setAnchorEl(null);
    safeOnSelect(option); // only call onSelect when a menu item is clicked
  };

  return (
    <AppBar position="static" sx={{ borderRadius: 2 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Tools
        </Typography>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose} // only closes menu
        >
          <MenuItem onClick={() => handleOptionClick("tts")}>
            Text To Speech
          </MenuItem>
          <MenuItem onClick={() => handleOptionClick("stt")}>
            Speech To Text
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
