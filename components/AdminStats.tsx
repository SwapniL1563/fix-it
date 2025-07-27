interface AdminStatsProps {
  totalUsers: number;
  verifiedTechs: number;
  pendingTechs: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings:number;
}

export default function AdminStats ({
  totalUsers,
  verifiedTechs,
  pendingTechs,
  totalBookings,
  completedBookings,
  cancelledBookings,
}: AdminStatsProps) {
   
    return (
      <div>
        <div>
            <h2>Total Users</h2>
            <p>{totalUsers}</p>
        </div>

        <div>
            <h2>Pending Technician</h2>
            <p>{pendingTechs}</p>
        </div>

        <div>
            <h2>Verified Technicians</h2>
            <p>{verifiedTechs}</p>
        </div>

        <div>
            <h2>Total Bookings</h2>
            <p>{totalBookings}</p>
        </div>

        <div>
            <h2>Completed Bookings</h2>
            <p>{completedBookings}</p>
        </div>

        <div>
            <h2>Cancelled Bookings</h2>
            <p>{cancelledBookings}</p>
        </div>


      </div>
    )
}