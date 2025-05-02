
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b border-border h-14 px-4 flex items-center justify-between bg-background z-10">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-nothing-black flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-nothing-blue"></div>
        </div>
        <span className="text-lg font-medium tracking-tight">prompt.compare</span>
      </div>
      
      <div className="flex gap-6">
        <Link to="/" className="text-sm font-medium hover:text-nothing-blue transition-colors">
          Test
        </Link>
        <Link to="/results" className="text-sm font-medium hover:text-nothing-blue transition-colors">
          Results
        </Link>
        <Link to="/models" className="text-sm font-medium hover:text-nothing-blue transition-colors">
          Models
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
