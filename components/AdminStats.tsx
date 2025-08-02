interface AdminStatsProps {
  totalUsers: number;
  verifiedTechs: number;
  pendingTechs: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export default function AdminStats({
  totalUsers,
  verifiedTechs,
  pendingTechs,
  totalBookings,
  completedBookings,
  cancelledBookings,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-2">
      <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
        <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{totalUsers}</p>
        <p className="text-sm md:text-base text-gray-200">Total Users</p>
      </div>

      <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
        <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{pendingTechs}</p>
        <p className="text-sm md:text-base text-gray-200">Pending Technicians</p>
      </div>

      <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
        <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{verifiedTechs}</p>
        <p className="text-sm md:text-base text-gray-200">Verified Technicians</p>
      </div>

      <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
        <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{totalBookings}</p>
        <p className="text-sm md:text-base text-gray-200">Total Bookings</p>
      </div>

      <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
        <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{completedBookings}</p>
        <p className="text-sm md:text-base text-gray-200">Completed Bookings</p>
      </div>

      <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
        <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{cancelledBookings}</p>
        <p className="text-sm md:text-base text-gray-200">Cancelled Bookings</p>
      </div>
    </div>
  );
}
