import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata = {
  title: "News Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f15] text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
