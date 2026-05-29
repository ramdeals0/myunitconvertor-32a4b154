import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-16">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The converter you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
          Back home
        </Link>
      </div>
    </div>
  );
}
