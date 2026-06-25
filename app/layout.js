import "./globals.css";

export const metadata = {
  title: "NEX SCRAPER",
  description: "Website Source Analyzer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
~/scraper/app $