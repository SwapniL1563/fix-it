"use client"

interface ConfirmCancelModalProps {
    onConfirm: () => void;
    onClose:() => void;
}

export default function BookingCancelModal({
    onConfirm,onClose
}: ConfirmCancelModalProps){
   return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Cancel Booking?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
   )
}