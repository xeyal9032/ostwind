import "../globals.css"; // Ensure global css is imported
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "OstWind Admin Panel",
  description: "OstWindGroup CMS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}
