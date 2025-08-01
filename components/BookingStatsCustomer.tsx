interface CustomerStatsProps {
    bookings: Booking[]
}

export default function BookingStatsCustomer ({bookings}:CustomerStatsProps) {
    return (
        <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 py-2">
            <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
                <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{bookings.length}</p>
                <p className="text-sm md:text-base text-gray-200">Total Booking</p>
            </div>

            <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
                <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{bookings.filter(b => b.status === "PENDING").length}</p>
                <p className="text-sm md:text-base text-gray-200">Pending Bookings</p>
            </div>

            <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition" >
                <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{bookings.filter(b => b.status === "ACCEPTED").length}</p>
                <p className="text-sm md:text-base text-gray-200">Accepted Bookings</p>
            </div>

            <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
                <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{bookings.filter(b => b.status === "COMPLETED").length}</p>
                <p className="text-sm md:text-base text-gray-200">Completed Bookings</p>
            </div>

            <div className="bg-[#0b0b0b] px-4 py-5 rounded-md flex flex-col gap-1 border border-[#181818] hover:border-[#ff7600]/20 transition">
                <p className="text-2xl md:text-3xl text-[#ff7600] font-semibold">{bookings.filter(b => b.status === "CANCELLED").length}</p>
                <p className="text-sm md:text-base text-gray-200">Cancelled Bookings</p>
            </div>


        </div>
    )
}