"use client";
import { PulseLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <PulseLoader color="#2E7AD1" />
      </div>
    </div>
  );
}
