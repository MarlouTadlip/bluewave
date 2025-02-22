"use client"
import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const handleScroll = (id: string) => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };
  return (
    
    <div className="layout">
        <Navbar handleScroll={handleScroll} />
        {children}
        <Footer/>
    </div>
  )
}

export default layout
