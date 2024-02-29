"use client";
import React from 'react'
// import { useRouter } from 'next/navigation';
type PostProps = {
  params: {
    key: string;
  };
};
const Page = ({ params } : PostProps) => {
  const key = params.key;
  return <div>pagexzc {key} </div>;
};

export default Page;