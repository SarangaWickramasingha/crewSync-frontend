import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '@/context/AuthContext';


export const metadata = {
    title: 'CrewSync',
    description: 'A comprehensive platform for coordinating construction activities',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="h-full">
            <body className="h-full flex flex-col">
                <AuthProvider>
                    <Navbar />
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>

            </body>
        </html>
    );
}