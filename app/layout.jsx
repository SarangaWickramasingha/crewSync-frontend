import './globals.css';

export const metadata = {
    title: 'CrewSync – Sign In',
    description: 'Sign in to your CrewSync account',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}