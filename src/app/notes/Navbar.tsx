"use client";
import AIChatButton from "@/components/AIChatButton";
import AddNoteDialog from "@/components/AddNoteDialog";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  return (
    <>
      <div className="p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3 m-auto max-w-7xl">
          <Link href={"notes"} className="flex items-center gap-1">
            <Image src={"/logo.png"} alt="logo" width={40} height={40} />
            <span className="font-bold">FlowBrain</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <Button onClick={() => setShowNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add note
            </Button>
            <AIChatButton />
          </div>
        </div>
      </div>
      {/* mert automatikusan az open prop csak elrejti így viszont meg se jeleníti */}
      {showNoteDialog && (
        <AddNoteDialog open={showNoteDialog} setOpen={setShowNoteDialog} />
      )}
    </>
  );
};

export default Navbar;
