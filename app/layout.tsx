import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
