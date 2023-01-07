import React, { useRef } from "react";
import { Footer, Header, SideBar } from ".";

export const Layout = ({ children }) => {
  const layoutRef = useRef(null);

  return (
    <div className="relative" ref={layoutRef}>
      <Header />
      <SideBar />
      <section className="bg-slate-100  min-h-screen top-16 mt-3 relative md:pl-60  p-2 sm:p-4 md:mb-0 mb-36 ">
        {children}
      </section>
      <Footer />
    </div>
  );
};
