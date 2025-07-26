"use client"

interface BookingCardsProps {
    id:string;
    customer:{
        name:string;
        email:string;
        address:string;
        city:string;
    },
    date:string;
    description:string;
    status:string;
    onUpdateStatus: (id:string,status:string) => void;
}

export default function BookingCardTechnician({ id, customer,date,description,status,onUpdateStatus}:BookingCardsProps){

    return (
       <div className="border rounded-md p-4 bg-white shadow-sm">
      <h2 className="text-lg font-bold">{customer.name}</h2>
      <p className="text-sm text-gray-600">{customer.email}</p>
      <p className="text-sm">{customer.city}</p>
      <p className="text-sm">{customer.address}</p>
      <p className="text-sm mt-2">Date: {new Date(date).toLocaleString()}</p>
      {description && <p className="text-sm italic mt-1">"{description}"</p>}
      <p className="mt-2 font-semibold">
        Status: <span className="capitalize">{status}</span>
      </p>

      <div className="mt-3 space-x-2">
        {status === "PENDING" && (
          <>
            <button
              onClick={() => onUpdateStatus(id, "ACCEPTED")}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => onUpdateStatus(id, "CANCELLED")}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </>
        )}

        {status === "ACCEPTED" && (
          <button
            onClick={() => onUpdateStatus(id, "COMPLETED")}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
    )
}