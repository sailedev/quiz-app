import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
	title: 'Quiz App',
	description: 'Test kunnskapen din med en quiz!',
	icons: {
		icon: [{ url: '/saile-logo.webp', type: 'image/png', sizes: '32x32' }],
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='no'>
			<head />
			<body>{children}</body>
		</html>
	);
}
