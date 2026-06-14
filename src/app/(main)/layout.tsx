import { AuthInitializer } from "@/features/auth/components/AuthInitializer";
import { EmailConfirmationBanner } from "@/features/auth/components/EmailConfirmationBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AuthInitializer>
        <Navbar />
        {children}
        <Footer />
        <EmailConfirmationBanner />
      </AuthInitializer>
    </ToastProvider>
  );
}
