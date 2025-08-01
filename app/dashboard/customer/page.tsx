import SidebarLayout from "@/components/Sidebar";
import CustomerDashboardContent from "@/components/CustomerDashboardContent";

export default function CustomerDashboardPage() {
  return (
    <SidebarLayout role="CUSTOMER">
      <CustomerDashboardContent />
    </SidebarLayout>
  );
}
