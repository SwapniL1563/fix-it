import SidebarLayout from "@/components/Sidebar";
import TechnicianDashboardJobsPage from "@/components/TechnicianDashboardJobsPage";

export default function TechnicianJobs() {
  return (
    <SidebarLayout role="TECHNICIAN">
      <TechnicianDashboardJobsPage />
    </SidebarLayout>
  );
}
