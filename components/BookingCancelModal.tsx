"use client"

interface ConfirmCancelModalProps {
    onConfirm: () => void;
    onClose:() => void;
}

export default function BookingCancelModal({
    onConfirm,onClose
}: ConfirmCancelModalProps){
   return (
     <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-[#0b0b0b] px-9 py-7 rounded border shadow-lg w-96">
        <h2 className="text-lg font-bold mb-2">Cancel Booking?</h2>
        <p className="text-sm text-neutral-400 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="flex  gap-2">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1 bg-[#ff7600] text-black font-medium rounded"
          >
            Yes, Cancel
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-none text-[#ff7600] font-medium border border-[#ff7600] rounded"
          >
            No, Keep Booking
          </button>
        </div>
      </div>
    </div>
   )
}