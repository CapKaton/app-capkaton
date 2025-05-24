"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = ["about", "experiences" , "projects", "skills"];

  return (
    <div className="w-full text-white mb-8">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-4">
        <div className="font-bold hover:text-white uppercase text-gray-400 text-lg tracking-widest">
          Inacio Silva
        </div>

        <button
          className="text-3xl text-gray-400 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <HiMenu />
        </button>

        <nav className="hidden md:flex items-center gap-6 text-lg text-gray-400">
          {navItems.map((item) => (
            <Link
              key={item}
              className="hover:text-white capitalize"
              href={`#${item}`}
            >
              {item === "about" ? "About Me" : item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-[#0c0f11] flex flex-col items-center justify-center md:hidden z-50 px-4">
          <div className="absolute top-4 right-4">
            <button
              className="text-4xl text-gray-400"
              onClick={toggleMenu}
              aria-label="Fechar menu"
            >
              <HiX />
            </button>
          </div>

          <ul className="flex flex-col gap-8 text-2xl text-gray-300 items-center justify-center h-full">
            {navItems.map((item) => (
              <li key={item}>
                <Link
                  href={`#${item}`}
                  className="hover:text-white capitalize "
                  onClick={() => setIsOpen(false)}
                >
                  {item === "about" ? "About Me" : item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
