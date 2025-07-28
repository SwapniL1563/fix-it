import axios from "axios";
import { useState } from "react"
interface ReviewModalProps {
  bookingId: string;
  technicianId: string;
  technicianName: string;
  onClose: () => void;
  onSuccess: () => void; 
}

const StarSelector = ({ rating , setRating}:{rating : number; setRating : (r:number) => void}) => {
    return (
        <div className="flex space-x-1 mb-3">
            {
                [1,2,3,4,5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} focus:outline-none`}>
                     {star <= rating ? "★" : "☆"}
                    </button>
                ))
            }
        </div>
    )
}

export default function ReviewModal({
    bookingId,technicianId,technicianName,onClose,onSuccess
}:ReviewModalProps) {
    const [ rating,setRating ] = useState(5);
    const [ comment,setComment ] = useState("");
    const [ loading,setLoading ] = useState(false);

    const submitReview = async () => {
        setLoading(true);
        try {
            const review = await axios.post("/api/review",{
                bookingId , rating , comment , technicianId
            });
            onSuccess();
            onClose();
        } catch(err) {
            console.error("Failed to submit review", err);
        } finally {
           setLoading(false);
        }
      }

    return (
        <div>
            <div>
                <h2>How was the services? Give technician {technicianName} a rating</h2>
                <StarSelector rating={rating} setRating={setRating} />
                <textarea title="comment" name="comment" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                <div>
                    <button onClick={onClose} disabled={loading}>Cancel</button>
                    <button onClick={submitReview} disabled={loading}>{loading ? "Submitting" : "Submit"}</button>
                </div>
            </div>
        </div>
    )
}