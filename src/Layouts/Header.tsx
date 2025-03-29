import { Menu } from "lucide-react";
import { FaUserFriends, FaUserTie } from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import logo from "../Assets/Images/split-logo.png";
import React, { useState } from "react";
import Button from "../Components/Button";
import { useSearchBarContext } from "../Context/SearchBarContext";

interface isLoggedInProps {
  isLoggedIn: boolean;
}

const Header = ({ isLoggedIn }: isLoggedInProps) => {
  const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
  const { onClick, handleChange, search } = useSearchBarContext();
  return (
    <div>
      <div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 mx-4">
        <div
          className={`gap-4 items-center flex-shrink-0 ${
            showFullWidthSearch ? "hidden" : "flex"
          }`}
        >
          <a href="/">
            <img src={logo} className="h-10"></img>
          </a>
        </div>
        {isLoggedIn && (
          <form
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
            <div className="flex flex-grow max-w-[600px]">
              <input
                onChange={handleChange}
                value={search}
                type="search"
                placeholder="Search Receipt"
                className="rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-lg w-full focus:border-blue-500 outline-none"
              ></input>
              <Button
                onClick={onClick}
                className="py-2 px-4 rounded-r-full border-secondary-border border border-l-0 flex-shrink-0"
              >
                <CiSearch />
              </Button>
            </div>
          </form>
        )}
        <div
          className={`flex-shrink-0 md:gap-2 ${
            showFullWidthSearch ? "hidden" : "flex"
          }`}
        >
          <Button
            onClick={() => setShowFullWidthSearch(true)}
            size="icon"
            buttonVariant="ghost"
            className="md:hidden"
          >
            <CiSearch />
          </Button>
          <Button size="icon" buttonVariant="ghost">
            <FaUserFriends />
          </Button>
          <Button size="icon" buttonVariant="ghost">
            <FaUserTie />
          </Button>
          <Button size="icon" buttonVariant="ghost">
            <RiUserSettingsFill />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
