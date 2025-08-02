import SidebarLayout from "@/components/Sidebar";
import AdminDashboardUsersContent from "@/components/AdminDashboardUsersPage";

export default function AdminDashboardUsersPage() {
  return (
    <SidebarLayout role="ADMIN">
      <AdminDashboardUsersContent />
    </SidebarLayout>
  );
}
