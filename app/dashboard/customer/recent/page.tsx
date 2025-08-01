import SidebarLayout from "@/components/Sidebar";
import CustomerRecentContent from "@/components/CustomerDashboardRecent";

export default function CustomerRecentPage() {
  return (
    <SidebarLayout role="CUSTOMER">
      <CustomerRecentContent />
    </SidebarLayout>
  );
}