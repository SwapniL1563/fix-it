import SidebarLayout from "@/components/Sidebar";

export default function PendingApprovalPage() {
  return (
    <SidebarLayout role="TECHNICIAN">
      <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0b0b0b] text-white px-4">
        <div className="bg-[#0b0b0b] border border-[#181818] hover:border-[#ff7600]/20 transition rounded-md p-6 md:p-10 max-w-md text-center shadow-md">
          <h1 className="text-xl md:text-2xl font-semibold text-[#ff7600] mb-4">
            Pending Approval
          </h1>
          <p className="text-start text-gray-300 text-sm md:text-base leading-relaxed">
            Your account is currently awaiting verification by an administrator.
            Once verified, you will gain full access to your dashboard and be able
            to get bookings.
          </p>

          <div className="mt-6">
            <div className="w-10 h-10 mx-auto border-4 border-[#ff7600] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-400 text-sm">Waiting for verification...</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
