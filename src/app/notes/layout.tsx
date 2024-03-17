import React from "react";
import Navbar from "./Navbar";

const NoteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="p-4 m-auto max-w-7xl">{children}</main>
    </div>
  );
};

export default NoteLayout;
