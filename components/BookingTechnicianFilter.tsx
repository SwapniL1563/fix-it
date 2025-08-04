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
    <div className="flex flex-wrap items-center gap-2 rounded-md w-full lg:w-2/3">
      <select
        className="p-3 text-[#828282] rounded bg-[#0b0b0b] border border-border w-full md:w-[25%] outline-none text-sm md:text-base"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <input
        className="p-3 rounded bg-[#0b0b0b] border border-border w-full md:w-2/3 lg:w-1/2 outline-none text-sm md:text-base"
        type="text"
        value={search}
        placeholder="Search by City, Customer Name"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
