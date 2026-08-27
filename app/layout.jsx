import './globals.css';
import ConditionalFooter from '@/src/components/layout/ConditionalFooter';
import { AuthProvider } from '@/context/AuthContext';
import QueryProvider from '@/src/components/providers/QueryProvider';

export const metadata = {
    title: 'CrewSync',
    description: 'A comprehensive platform for coordinating construction activities',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-screen flex flex-col">
                <QueryProvider>
                    <AuthProvider>
                        {children}
                        <ConditionalFooter />
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}