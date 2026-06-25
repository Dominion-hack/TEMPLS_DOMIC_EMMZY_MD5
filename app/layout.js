export const metadata = {
  title: "NEX SCRAPER",
  description: "Website Analyzer"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}