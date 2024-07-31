import {
  TypographyH1,
  TypographyH2,
  TypographyLead,
} from "@/components/typographies";
import { FreeEvalSlotsTable } from "./_components/free-eval-slots-table";
import { BookedSlotsCards } from "./_components/booked-slots-cards";

export default async function Page() {
  return (
    <main className="flex flex-col gap-2">
      <TypographyH1>Cadet Dashboard</TypographyH1>
      <TypographyH2>Upcoming evaluation</TypographyH2>
      <BookedSlotsCards />
      <TypographyH2>Available evaluation slots</TypographyH2>
      <TypographyLead className="text-sm">
        Here you can book evaluation slots with tutors. Only one slot can be
        booked at a time. Booked slot cannot be cancelled after 30 minutes. Slot
        must be booked at least 24 hours in advance.
      </TypographyLead>
      <FreeEvalSlotsTable />
    </main>
  );
}
