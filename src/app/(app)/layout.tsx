import { AppShell } from "@/components/AppShell";
import { TierGate } from "@/components/TierGate";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <TierGate>{children}</TierGate>
    </AppShell>
  );
}
