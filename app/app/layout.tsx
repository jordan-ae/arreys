import "~/styles/globals.css";

import { twMerge } from "tailwind-merge";

export const metadata = {
  title: "Handshake is running",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <head>
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤝</text></svg>"
          />
        </head>
        <link rel="shortcut icon" href="/favicon.png" />
      </head>

      <body
        className={twMerge(
          "bg-neutral-950 text-neutral-50"
        )}
      >
        {children}
      </body>
    </html>
  );
}
