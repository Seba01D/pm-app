import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import { Toaster } from "sonner";
import QueryClientProvider from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} `}>
				<QueryClientProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="White"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster position="top-center" richColors />
					</ThemeProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
