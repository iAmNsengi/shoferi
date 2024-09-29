import React, { useEffect, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import { HiMenuAlt3 } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';
import MenuList from './MenuList';

const Navbar = () => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem('userInfo'));
  const company = JSON.parse(localStorage.getItem('companyInfo'));
  const [isOpen, setIsOpen] = useState(false);
  const [LoggedIn, setLoggedIn] = useState(null);
  useEffect(() => {
    const loginUser = auth || company;
    if (loginUser) {
      setLoggedIn(loginUser);
    } else {
      setLoggedIn(null);
    }
  }, [auth?.token, auth?.user?.accountType, company?.token, company?.company]);
  const user = LoggedIn;
  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="relative bg-[#f7fdfd] z-50">
        <nav className="container mx-auto flex items-center justify-between p-5">
          <div className="bg-gray-700 p-4">
            <Link to="/" className="text-orange-600 font-bold text-xl">
              shoferi.<span className="text-white">com</span>
            </Link>
          </div>

          <ul className="hidden lg:flex gap-10 text-base">
            <li>
              <Link to="/">Find Job</Link>
            </li>
            <li>
              <Link to="/companies">Companies</Link>
            </li>
            <li>
              <Link to="/upload-job">Upload Job</Link>
            </li>
            <li>
              <Link to="/about-us">About</Link>
            </li>
          </ul>

          <div className="hidden lg:block">
            {!user?.token ? (
              <Link to="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles="text-orange-600 py-1.5 px-5 focus:outline-none hover:bg-orange-700 hover:text-white rounded-full text-base border border-orange-600"
                />
              </Link>
            ) : (
              <div>
                <MenuList user={user?.user} />
              </div>
            )}
          </div>

          <button
            className="block lg:hidden text-slate-900"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        <div
          className={`${
            isOpen ? 'absolute flex bg-[#f7fdfd] ' : 'hidden'
          } container mx-auto lg:hidden flex-col pl-8 gap-3 py-5`}
        >
          <Link to="/" onClick={handleCloseNavbar}>
            Find Job
          </Link>
          <Link to="/companies" onClick={handleCloseNavbar}>
            Companies
          </Link>
          <Link
            onClick={handleCloseNavbar}
            to={
              user?.accountType === 'seeker'
                ? 'Application-History'
                : 'Upload-job'
            }
          >
            {user?.accountType === 'seeker' ? 'Applications' : 'Upload Job'}
          </Link>
          <Link to="/about-us" onClick={handleCloseNavbar}>
            About
          </Link>

          <div className="w-full py-10">
            {!user?.token ? (
              <a href="/user-auth">
                <CustomButton
                  title="Sign In"
                  containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
                />
              </a>
            ) : (
              <div>
                <MenuList user={user} onClick={handleCloseNavbar} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
