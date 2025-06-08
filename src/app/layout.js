import localFont from "next/font/local";

import Header from "components/header";
import Footer from "components/footer";

import { ThemeProvider } from "context/theme-context";

import "styles/globals.css";

const oxygen = localFont({
  src: "./styles/fonts/oxygen.woff2",
  variable: "--primary-font-family"
});

const comicRelief = localFont({
  src: "./styles/fonts/comic-relief.woff2",
  variable: "--secondary-font-family"
});

export const metadata = {
  title: "Enigma",
  description: "Application that allows you to create anonymous notes while maintaining top-notch security."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${oxygen.variable} ${comicRelief.variable}`}>
        <ThemeProvider>
          <Header />
          <main className="md:px-qp">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};