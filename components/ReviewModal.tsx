import axios from "axios";
import { useState } from "react";

interface ReviewModalProps {
  bookingId: string;
  technicianId: string;
  technicianName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const StarSelector = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => {
  return (
    <div className="flex space-x-1 mb-4 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`text-3xl ${
            star <= rating ? "text-yellow-400" : "text-gray-500"
          } focus:outline-none`}
        >
          {star <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default function ReviewModal({
  bookingId,
  technicianId,
  technicianName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    setLoading(true);
    try {
      await axios.post("/api/review", {
        bookingId,
        rating,
        comment,
        technicianId,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
      <div className="bg-[#0b0b0b] p-6 rounded-md border border-[#181818] shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-300 mb-2">
        Share your feedback</h2>
       <p className=" text-gray-400 mb-2">
      We hope you liked the service! Please rate your experience with{" "}
      <span className="text-[#ff7600] font-medium">{technicianName}</span></p>
        <StarSelector rating={rating} setRating={setRating} />
        <textarea
          title="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment about the service..."
          className="border border-[#181818] bg-[#121212] p-2 w-full rounded text-gray-300 mb-4 outline-none resize-none"
          rows={4}
        ></textarea>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded border-gray-600 text-gray-300 hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={submitReview}
            disabled={loading}
            className="px-4 py-2 bg-[#ff7600] text-black font-medium rounded hover:bg-[#e66900] transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
