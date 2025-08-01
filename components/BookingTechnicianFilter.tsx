interface BookingFilterProps {
  status: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function BookingFilter({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: BookingFilterProps) {
  return (
    <div className="flex gap-4">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border p-2"
      >
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <input
        type="text"
        value={search}
        placeholder="Search by name or city"
        onChange={(e) => onSearchChange(e.target.value)}
        className="border p-2 flex-1"
      />
    </div>
  );
}
