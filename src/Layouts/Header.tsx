import { FaUserFriends } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { MdKeyboardDoubleArrowLeft, MdLogout, MdLogin, MdClear } from "react-icons/md";
import logo from "../Assets/Images/split-logo.png";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import { useSearchBarContext } from "../Context/SearchBarContext";
import { useAuth } from "../Context/AuthContext";
import SearchDropdown from "../Components/SearchDropdown/SearchDropdown";

const Header = () => {
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { onClick, handleChange, search, clearSearch } = useSearchBarContext();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleAuthButtonClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const value = e.target.value;
    if (value.trim() !== "") {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSearchFocus = () => {
    if (search && search.trim() !== "") {
      setShowDropdown(true);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowDropdown(false);
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
  };
  return (
    <div>
      <div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 mx-4">
        <div
          className={`gap-4 items-center flex-shrink-0 ${
            showFullWidthSearch ? "hidden" : "flex"
          }`}
        >
          <a href="/">
            <img src={logo} className="h-10" alt="Split App Logo"></img>
          </a>
        </div>
        {isAuthenticated && (
          <form
            onSubmit={handleSearchSubmit}
            className={`gap-4 flex-grow justify-center ${
              showFullWidthSearch ? "flex" : "hidden md:flex"
            }`}
          >
            {showFullWidthSearch && (
              <Button
                onClick={() => setShowFullWidthSearch(false)}
                type="button"
                size="icon"
                buttonVariant="ghost"
                className="flex-shrink-0"
              >
                <MdKeyboardDoubleArrowLeft />
              </Button>
            )}
            <div className="flex flex-grow max-w-[600px] relative">
              <input
                ref={searchInputRef}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                value={search}
                type="text"
                placeholder="Search by establishment, receipt code, item name, or total..."
                className="rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-1 px-4 pr-10 text-lg w-full focus:border-blue-500 outline-none"
              />
              {search && search.length > 0 && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  type="button"
                  title="Clear search"
                >
                  <MdClear size={16} />
                </button>
              )}
              <Button
                type="submit"
                className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0 flex-shrink-0"
                title="Search receipts"
              >
                <CiSearch />
              </Button>
              
              {/* Search Dropdown */}
              <SearchDropdown 
                isOpen={showDropdown} 
                onClose={() => setShowDropdown(false)}
                searchInputRef={searchInputRef}
              />
            </div>
          </form>
        )}
        <div
          className={`flex-shrink-0 md:gap-2 ${
            showFullWidthSearch ? "hidden" : "flex"
          }`}
        >
          {isAuthenticated && (
            <Button
              onClick={() => setShowFullWidthSearch(true)}
              size="icon"
              buttonVariant="ghost"
              className="md:hidden"
            >
              <CiSearch />
            </Button>
          )}
          {isAuthenticated && (
            <Button size="icon" buttonVariant="ghost">
              <FaUserFriends />
            </Button>
          )}
          <Button 
            onClick={handleAuthButtonClick}
            size="icon" 
            buttonVariant="ghost"
            title={isAuthenticated ? `Logout (${user?.userName})` : "Login"}
          >
            {isAuthenticated ? <MdLogout /> : <MdLogin />}
          </Button>
          {isAuthenticated && (
            <Button size="icon" buttonVariant="ghost">
              <RiUserSettingsFill />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
