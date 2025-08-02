import SidebarLayout from "@/components/Sidebar";
import AdminDashboard from "@/components/AdminDashboardContent";

export default function AdminDashboardPage() {
  return (
    <SidebarLayout role="ADMIN">
      <AdminDashboard />
    </SidebarLayout>
  );
}
