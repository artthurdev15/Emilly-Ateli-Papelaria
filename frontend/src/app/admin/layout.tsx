import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <header className="h-14 border-b border-rose-100 bg-paper/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
          <h1 className="text-sm text-gray-400 font-medium">
            Painel Administrativo
          </h1>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
