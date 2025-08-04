import SidebarLayout from "@/components/Sidebar";
import TechnicianDashboardContent from "@/components/TechnicianDashboardContent";

export default function TechnicianDashboardPage() {
  return (
    <SidebarLayout role="TECHNICIAN">
      <TechnicianDashboardContent />
    </SidebarLayout>
  );
}
