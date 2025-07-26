interface BookingCustomerFilterProps {
    status:string,
    onStatusChange: (status:string) => void,
    search:string,
    onSearchChange:(serch:string) => void
}

export default function BookingCustomerFilter({
    status,onStatusChange,search,onSearchChange
}:BookingCustomerFilterProps){
    return (<div>
        <input type="text" value={search} onChange={(e) => onSearchChange(e.target.value)} />
        <select value={status} onChange={(e)=> onStatusChange(e.target.value)} id="">
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
        </select>
    </div>)
}