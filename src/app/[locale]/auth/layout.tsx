/** Giriş / qeydiyyat — header və footer ilə eyni layout */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-scene flex min-h-[calc(100dvh-12rem)] items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
