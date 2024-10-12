"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IFromInput {
  from: string;
}

export const FromInput = (p: IFromInput) => {
  const [value, setValue] = useState(p.from);
  const router = useRouter();
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(value);
    const url = `/staff/evaluation-slots?from=${value}`;
    console.log(url);
    router.push(url);
  }
  return (
    <form className="flex gap-2 max-w-64">
      <Button onClick={(e) => handleSubmit(e)}>Search from</Button>
      <Input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
};
