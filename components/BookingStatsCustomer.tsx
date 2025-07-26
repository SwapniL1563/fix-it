interface CustomerStatsProps {
    bookings: Booking[]
}

export default function BookingStatsCustomer ({bookings}:CustomerStatsProps) {
    return (
        <div className="grid grid-cols-5 gap-2">
            <div>
                <p>{bookings.length}</p>
                <p>Total Booking</p>
            </div>

            <div>
                <p>{bookings.filter(b => b.status === "PENDING").length}</p>
                <p>Pending Bookings</p>
            </div>

            <div>
                <p>{bookings.filter(b => b.status === "ACCEPTED").length}</p>
                <p>Accepted Bookings</p>
            </div>

            <div>
                <p>{bookings.filter(b => b.status === "COMPLETED").length}</p>
                <p>Completed Bookings</p>
            </div>

            <div>
                <p>{bookings.filter(b => b.status === "CANCELLED").length}</p>
                <p>Cancelled Bookings</p>
            </div>


        </div>
    )
}