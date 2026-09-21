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