import React from "react";
import Link from "next/link";

const SmallCard = ({
  title,
  amount,
  link,
}: {
  title: string;
  amount: number;
  link: string;
}) => {
  return (
    <Link
      href={link}
      className="h-[25vh] w-1/4 rounded-3xl border-2 border-black p-4"
    >
      <h1 className="text-3xl">{title}</h1>
      <div className="flex items-end justify-evenly">
        <h1 className="text-8xl">{amount}</h1>
        <h1 className="text-3xl">{`view >>>`}</h1>
      </div>
    </Link>
  );
};

export default SmallCard;
