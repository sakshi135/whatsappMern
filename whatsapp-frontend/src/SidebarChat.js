import { Avatar } from "@mui/material";
import React from "react";
import "./SidebarChat.css";

function SidebarChat() {
  return (
    <div className="sidebarChat">
      <Avatar />
      <div className="sidebarChat_info">
        <h2>Shruti</h2>

        <p>kya h </p>
      </div>
    </div>
  );
}

export default SidebarChat;
