import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🔥 PREVENT THEME FLASH (runs before React) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme =
      stored === 'dark' || (stored === 'system' && systemDark)
        ? 'dark'
        : 'light';

    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(
      theme === 'dark' ? 'dark-mode' : 'light-mode'
    );

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
            `,
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
