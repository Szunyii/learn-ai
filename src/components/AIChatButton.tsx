"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import AIChatbox from "./AIChatbox";
import { Bot } from "lucide-react";

const AIChatButton = () => {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI chat
      </Button>
      <AIChatbox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
};

export default AIChatButton;
