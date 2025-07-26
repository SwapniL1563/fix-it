"use client"

interface TechnicianStatsProps {
    bookings:Booking[];
}

export default function TechnicianStats({ bookings}: TechnicianStatsProps){
    return (
        <div className="grid grid-cols-5">
            <div className="bg-red-100 border">
                <p>{bookings.length}</p>
                <p>Total</p>
            </div>

            <div className="bg-red-100 border">
                <p>{bookings.filter(b => b.status === "PENDING").length}</p>
                <p>Pending</p>
            </div>

            <div className="bg-red-100 border">
                <p>{bookings.filter(b => b.status === "ACCEPTED").length}</p>
                <p>ACCEPTED</p>
            </div>

            <div className="bg-red-100 border">
                <p>{bookings.filter(b => b.status === "COMPLETED").length}</p>
                <p>COMPLETED</p>
            </div>

            <div className="bg-red-100 border">
                <p>{bookings.filter(b => b.status === "CANCELLED").length}</p>
                <p>CANCELLED</p>
            </div>
        </div>
    )
}