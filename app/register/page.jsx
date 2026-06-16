import RegisterForm from '@/features/auth/RegisterForm';

export const metadata = {
    title: 'Register – CrewSync',
    description: 'Create your CrewSync account as a Property Owner, Service Provider, or Supplier.',
};

export default function RegisterPage() {
    return (
        // Navbar + Footer already exist in your layout — no need to repeat them here.
        // The (auth) route group's layout.jsx wraps this page.
        <div className="flex-1 flex items-start justify-center px-4 py-8 bg-surface relative overflow-hidden">
            {/* Subtle radial glow — top-right */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 w-[450px] h-[450px]
          rounded-full bg-[radial-gradient(circle,rgba(27,110,58,0.07)_0%,transparent_70%)]"
            />
            <RegisterForm />
        </div>
    );
}
