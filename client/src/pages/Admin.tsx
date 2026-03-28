import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users, Download, Search, ArrowUpDown, ArrowUp, ArrowDown,
  Calendar, Mail, Phone, Baby, LogIn, Shield, Home as HomeIcon,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";

type SortField = "createdAt" | "firstName" | "lastName" | "adultsCount" | "childrenCount";
type SortDir = "asc" | "desc";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: registrations, isLoading, refetch } = trpc.admin.listRegistrations.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
    return sortDir === "asc"
      ? <ArrowUp className="w-3.5 h-3.5 text-primary" />
      : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  };

  const filtered = (registrations ?? []).filter(r => {
    const q = search.toLowerCase();
    return (
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let av: string | number = a[sortField] instanceof Date ? (a[sortField] as Date).getTime() : (a[sortField] as string | number);
    let bv: string | number = b[sortField] instanceof Date ? (b[sortField] as Date).getTime() : (b[sortField] as string | number);
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const exportCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("No registrations to export.");
      return;
    }
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Adults", "Children", "Notes", "Registered At"];
    const rows = registrations.map(r => [
      r.id,
      `"${r.firstName}"`,
      `"${r.lastName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      r.adultsCount,
      r.childrenCount,
      `"${r.notes ?? ""}"`,
      new Date(r.createdAt).toLocaleString(),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `homebuyer-extravaganza-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${registrations.length} registrations.`);
  };

  const totalAdults = (registrations ?? []).reduce((s, r) => s + r.adultsCount, 0);
  const totalChildren = (registrations ?? []).reduce((s, r) => s + r.childrenCount, 0);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Access</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access the admin dashboard.</p>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <a href={getLoginUrl()}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </a>
          </Button>
          <Link href="/" className="block mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Event Page
          </Link>
        </div>
      </div>
    );
  }

  // Not admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges to view this page.</p>
          <Link href="/" className="text-sm text-primary hover:underline">← Back to Event Page</Link>
        </div>
      </div>
    );
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
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button size="sm" onClick={exportCSV} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              View Event Page →
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Registrations", value: registrations?.length ?? 0, icon: Users, color: "text-primary" },
            { label: "Total Adults", value: totalAdults, icon: Users, color: "text-blue-600" },
            { label: "Total Children", value: totalChildren, icon: Baby, color: "text-pink-600" },
            { label: "Total Attendees", value: totalAdults + totalChildren, icon: Users, color: "text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
              <div className={`${stat.color} mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-foreground text-lg">Registrations</h2>
              <p className="text-muted-foreground text-sm">
                {filtered.length} of {registrations?.length ?? 0} total
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground mt-3 text-sm">Loading registrations...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                {search ? "No registrations match your search." : "No registrations yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {[
                      { label: "Name", field: "firstName" as SortField },
                      { label: "Email", field: null },
                      { label: "Phone", field: null },
                      { label: "Adults", field: "adultsCount" as SortField },
                      { label: "Children", field: "childrenCount" as SortField },
                      { label: "Registered", field: "createdAt" as SortField },
                      { label: "Notes", field: null },
                    ].map(({ label, field }) => (
                      <th
                        key={label}
                        className={`text-left px-4 py-3 font-semibold text-muted-foreground ${field ? "cursor-pointer hover:text-foreground select-none" : ""}`}
                        onClick={() => field && handleSort(field)}
                      >
                        <div className="flex items-center gap-1.5">
                          {label}
                          {field && <SortIcon field={field} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{r.firstName} {r.lastName}</div>
                        <div className="text-muted-foreground text-xs">#{r.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <a href={`mailto:${r.email}`} className="hover:text-primary transition-colors truncate max-w-[180px]">{r.email}</a>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          {r.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="secondary" className="font-semibold">{r.adultsCount}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="font-semibold">{r.childrenCount}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="text-muted-foreground text-xs mt-0.5">
                          {new Date(r.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <span className="text-muted-foreground text-xs truncate block">{r.notes || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
