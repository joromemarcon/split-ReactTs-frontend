import {
  FilePlus,
  FilePlus2,
  Home,
  PlusCircle,
  Receipt,
  ReceiptCent,
  ReceiptIcon,
  ReceiptText,
  Repeat,
  User2,
} from "lucide-react";
import React, { ElementType } from "react";
import { buttonStyles } from "../Components/Button";
import { twMerge } from "tailwind-merge";
import { text } from "stream/consumers";
import { IoReceiptOutline } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";
import { useContent } from "../Context/ContentContext";

interface SideBarProps {}

const SideBar = () => {
  const { setCurrentContent } = useContent();
  return (
    <>
      <aside className="sticky top-0 overflow-y-auto scrollbar-hidden pb-4 flex flex-col ml-1 lg:hidden">
        <SmallSideBarItem
          Icon={Home}
          title="Home"
          onClick={() => setCurrentContent("home")}
        />
        <SmallSideBarItem
          Icon={ReceiptText}
          title="Receipts"
          onClick={() => setCurrentContent("receipts")}
        />
        <SmallSideBarItem
          Icon={FilePlus2}
          title="New Receipt"
          onClick={() => setCurrentContent("new-receipt")}
        />
        <SmallSideBarItem
          Icon={Repeat}
          title="Join Receipt"
          onClick={() => setCurrentContent("join-receipt")}
        />
      </aside>
      <aside className="hidden lg:flex w-56 lg:sticky absolute top-16 overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2">
        <LargeSideBarItem
          Icon={Home}
          title="Home"
          onClick={() => setCurrentContent("home")}
        />
        <LargeSideBarItem
          Icon={ReceiptText}
          title="Receipts"
          onClick={() => setCurrentContent("receipts")}
        />
        <LargeSideBarItem
          Icon={FilePlus2}
          title="New Receipt"
          onClick={() => setCurrentContent("new-receipt")}
        />
        <LargeSideBarItem
          Icon={Repeat}
          title="Join Receipt"
          onClick={() => setCurrentContent("join-receipt")}
        />
      </aside>
    </>
  );
};

interface SmallSideBarItemProps {
  Icon: ElementType;
  title: string;
  onClick: () => void;
}
function SmallSideBarItem({ Icon, title, onClick }: SmallSideBarItemProps) {
  return (
    <a
      onClick={onClick}
      className={twMerge(
        buttonStyles({ buttonVariant: "ghost" }),
        "py-4 px-1 flex flex-col items-center rounded-lg gap-1"
      )}
    >
      <Icon className="w-6 h-6"></Icon>
      <div className="text-sm">{title}</div>
    </a>
  );
}

interface LargeSideBarItemProps {
  Icon: ElementType;
  title: string;
  onClick: () => void;
  isActive?: Boolean;
}
function LargeSideBarItem({
  Icon,
  title,
  onClick,
  isActive = false,
}: LargeSideBarItemProps) {
  return (
    <a
      onClick={onClick}
      className={twMerge(
        buttonStyles({ buttonVariant: "ghost" }),
        `w-full flex items-center rounded-lg gap-4 p-3 ${
          isActive ? "font-bold bg-neutral-100 hover:bg-secondary" : undefined
        }`
      )}
    >
      <Icon className="w-6 h-6"></Icon>
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </div>
    </a>
  );
}

export default SideBar;
