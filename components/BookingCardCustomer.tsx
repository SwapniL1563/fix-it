interface BookingCardCustomerProps {
  id:string;
  date: string;
  status: string;
  technician: {
    name: string;
    email: string;
    city: string;
    address:string;
  };
  service: string;
  description: string;
  onCancel:(id:string) => void;
}

export default function BookingCardCustomer({
  id,
  date,
  status,
  technician,
  service,
  description,
  onCancel
}: BookingCardCustomerProps) {
  return (
    <div className="border p-4 rounded bg-white shadow">
      <h3 className="font-semibold">{technician.name}</h3>
      <p>{technician.email}</p>
      <p>{technician.city}</p>
       <p>{technician.address}</p>
      <p className="text-sm text-gray-500">Service: {service}</p>
      <p className="mt-1">Date: {new Date(date).toLocaleString()}</p>
      <p>Status: {status}</p>
      {description && <p className="italic mt-1">"{description}"</p>
      }

      { status === "PENDING" && (
        <button onClick={() => onCancel(id)}>Cancel Booking</button>
      )}
    </div>
  );
}
