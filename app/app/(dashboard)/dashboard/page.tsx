import {
  TypographyH1,
  TypographyH2,
  TypographyLead,
} from "@/components/typographies";
import { FreeEvalSlotsTab } from "./_components/free-eval-slots-tab";

export default async function Page() {
  return (
    <main className="flex flex-col gap-2">
      <TypographyH1>Cadet Dashboard</TypographyH1>
      <TypographyH2>Upcoming evaluation</TypographyH2>
      {"TODO: Show booked slot here, also edit booked slot"}
      <TypographyH2>Available evaluation slots</TypographyH2>
      <TypographyLead className="text-sm">
        Here you can book evaluation slots with tutors. Only one slot can be
        booked at a time. Booked slot cannot be canncelled. Slot must be booked
        at least 24 hours in advance.
      </TypographyLead>

      <FreeEvalSlotsTab />
    </main>
  );
}
