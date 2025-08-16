import "./globals.css";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata = {
  title: "Hotel Booking System",
  description: "Book your perfect stay with our easy-to-use booking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
