import VoltGuardNavbar from "@/components/Navbar";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* Note: I removed the 70px padding from <main> and put it in a wrapper 
            so it doesn't mess with the body height/scroll */}
        <body className="antialiased bg-black text-white">
          <VoltGuardNavbar />
          <div className="pt-20"> {/* Matches Navbar height exactly */}
            {children}
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}