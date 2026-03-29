import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Shield, Home as HomeIcon,
  Lock, Eye, EyeOff, LogOut, ExternalLink, TableProperties
} from "lucide-react";
import { Link } from "wouter";

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1FAIpQLSfLCJ2-TBQ7jUhQRLmtMZbvkZtDGw-U8z-TwcOe03oeqyHOEQ/edit";

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      toast.success("Welcome to the admin dashboard!");
      onSuccess();
    },
    onError: (err) => {
      setError(err.message || "Incorrect password. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }
    loginMutation.mutate({ password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Homebuyer Extravaganza Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 rounded-xl"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to Event Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const utils = trpc.useUtils();

  const { data: sessionData, isLoading: sessionLoading, refetch: refetchSession } =
    trpc.admin.checkSession.useQuery();
  const isAuthenticated = sessionData?.authenticated === true;

  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      utils.admin.checkSession.invalidate();
      toast.success("Logged out successfully.");
    },
  });

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => refetchSession()} />;
  }

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <HomeIcon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm">Admin Dashboard</h1>
              <p className="text-muted-foreground text-xs">Homebuyer Extravaganza 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="gap-1.5 text-muted-foreground"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              View Event Page →
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <TableProperties className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Registrations are in Google Sheets
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            All event registrations submitted through the Google Form are automatically
            saved to your Google Sheet. Click below to view and manage them.
          </p>
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-12 px-8 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all">
              <ExternalLink className="w-5 h-5" />
              Open Google Sheet
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
