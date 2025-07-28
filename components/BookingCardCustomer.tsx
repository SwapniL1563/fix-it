import { useState } from "react";
import ReviewModal from "./ReviewModal";

interface BookingCardCustomerProps {
  id:string;
  date: string;
  status: string;
  technician: {
    id:string;
    name: string;
    email: string;
    city: string;
    address:string;
  };
  service: string;
  description: string;
  onCancel:(id:string) => void;
  reviewExists:boolean;
}

export default function BookingCardCustomer({
  id,
  date,
  status,
  technician,
  service,
  description,
  reviewExists,
  onCancel
}: BookingCardCustomerProps) {
  const [ showReviewModal,setShowReviewModal] = useState(false)
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

      {status === "COMPLETED" && !reviewExists && (
        <button onClick={()=>setShowReviewModal(true)}>Review</button>
      )}

      {showReviewModal && (
        <ReviewModal 
        bookingId={id} 
        technicianId={technician.id}
        technicianName={technician.name}
        onClose={()=> setShowReviewModal(false)}
        onSuccess={()=> window.location.reload()}
        />
      )}
    </div>
  );
}
