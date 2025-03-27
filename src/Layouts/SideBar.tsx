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

const SideBar = () => {
  return (
    <>
      <aside className="sticky top-0 overflow-y-auto scrollbar-hidden pb-4 flex flex-col ml-1 lg:hidden">
        <SmallSideBarItem Icon={Home} title="Home" url="/" />
        <SmallSideBarItem Icon={ReceiptText} title="Receipts" url="/" />
        <SmallSideBarItem Icon={FilePlus2} title="New Receipt" url="/" />
      </aside>
      <aside className="hidden lg:flex w-56 lg:sticky absolute top-16 overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2">
        <LargeSideBarItem Icon={Home} title="Home" url="/" />
        <LargeSideBarItem Icon={ReceiptText} title="Receipts" url="/" />
        <LargeSideBarItem Icon={FilePlus2} title="New Receipt" url="/" />
      </aside>
    </>
  );
};

interface SmallSideBarItemProps {
  Icon: ElementType;
  title: string;
  url: string;
}
function SmallSideBarItem({ Icon, title, url }: SmallSideBarItemProps) {
  return (
    <a
      href={url}
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
  url: string;
  isActive?: Boolean;
}
function LargeSideBarItem({
  Icon,
  title,
  url,
  isActive = false,
}: LargeSideBarItemProps) {
  return (
    <a
      href={url}
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
