"use client"

import BookingCancelModal from "@/components/BookingCancelModal";
import BookingCardCustomer from "@/components/BookingCardCustomer";
import BookingCustomerFilter from "@/components/BookingCustomerFilter";
import BookingModal from "@/components/BookingModal";
import BookingStatsCustomer from "@/components/BookingStatsCustomer";
import StarRating from "@/components/StarRating";
import axios from "axios";
import { useEffect, useState } from "react"

interface Technician {
   id:string,
   bio:string,
   verified:boolean,
   avgRating:string,
   user:{
      name:string,
      email:string,
      city:string,
      address:string,
   },
   service:{
      name:string
   }
}

interface Services {
   name:string,
   id:string,
}

interface Booking {
  id: string;
  date: string;
  description: string;
  status: string;
  technician: {
    id:string;
    user: {
      id:string,
      name: string;
      email: string;
      city: string;
      address:string;
    };
    service: {
      name: string;
    };
  },
  review?:{ id:string} | null;
}

export default function CustomerDashboard(){
   const [technicians,setTechnician] = useState<Technician[]>([]);
   const [services,setServices] = useState<Services[]>([]);
   const [filters,setFilters] = useState({serviceId:"",city:""});
   const [loading,setLoading] = useState(false);
   const [selectedTech,setSelectedTech] = useState<string | null>(null);
   const [bookings,setBookings] = useState<Booking[]>([]);
   const [bookingsLoading,setBookingsLoading] = useState(true);
   const [search, setSearch] = useState("");
   const [statusFilter, setStatusFilter] = useState(""); 
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);


   // fetch all services
   useEffect(()=> {
      const fetchServices = async () => {
         const res = await axios.get("/api/services");
         setServices(res.data);
      };

      fetchServices();
   },[]);

   // fetch technician with filterd
   const fetchTechnicians = async () => {
      setLoading(true);

      try {
         const params = new URLSearchParams();
         if(filters.serviceId) params.append("serviceId",filters.serviceId);
         if(filters.city) params.append("city",filters.city);

         const res = await axios.get(`/api/technicians/filtered?${params.toString()}`);
         setTechnician(res.data)
      } catch (error) {
         console.error("Error fetching technicians" , error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(()=> {
      fetchTechnicians()
   },[]);

   const fetchBookings = async () => {
      setBookingsLoading(true);
      try{
         const res = await axios.get("/api/bookings");
         setBookings(res.data);
      } catch(error){
         console.error("Error fetching bookings",error);
      } finally {
         setBookingsLoading(false);
      }
   }

   useEffect(()=> {
      fetchBookings();
   },[])

   const filteredBookings = bookings.filter((item)=> {
      return ( 
         (statusFilter === "" || item.status === statusFilter) && (
         item.technician.user.name.toLowerCase().includes(search.toLowerCase()) || item.technician.user.city.toLowerCase().includes(search.toLowerCase())
      ))
   })

   const handleCancelClick = (id:string) => {
      setSelectedBookingId(id);
      setShowConfirmModal(true);
   };

   const confirmCancel = async () => {
      if(!selectedBookingId) return;
      await axios.patch(`/api/bookings/${selectedBookingId}`,{status : "CANCELLED"});
      fetchBookings();
   }
   return (
      <div>
         <h1>Customer Dashboard</h1>

         <BookingStatsCustomer bookings={bookings} />

         <div className="bg-red-100">
            <select title="filters" value={filters.serviceId} onChange={(e) => setFilters({ 
               ...filters,
               serviceId:e.target.value
            })}>

            <option value="">All Services</option>
            { services.map((s)=> (
               <option value={s.id} key={s.id}>
                  {s.name}
               </option>
            ))}

            </select>

            <input type="text" placeholder="city" value={filters.city} onChange={(e) => {
               setFilters({...filters,city:e.target.value})
            }} />


            <button onClick={fetchTechnicians}>Apply filters</button>
         </div>

         {
            loading ? ( 
            <p>Technicians loadings...</p> 
            ) : technicians.length === 0 ? ( 
            <p>No verified technicians</p> 
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {technicians.map((item) => (
                     <div key={item.id}>
                        <div>
                           <h2>{item.user.name}</h2>
                           <p>{item.user.email}</p>
                           <p>{item.user.city}</p>
                           <p>{item.user.address}</p>
                           <p>{item.bio}</p>
                           <p>Rating:{item.avgRating}</p>
                           <StarRating rating={parseFloat(item.avgRating)} />
                        </div>

                        <button onClick={() => setSelectedTech(item.id)}>Book appointment</button>
                     </div>
                  ))}
               </div>
            )
         }

         { selectedTech && (
            <BookingModal technicianId={selectedTech}
            onClose={()=> setSelectedTech(null)}
            onBooked={()=> fetchTechnicians()}/>
         )}

         <div>
            <h2>Your Previous Bookings</h2>

            <BookingCustomerFilter status={statusFilter} onStatusChange={setStatusFilter} search={search} onSearchChange={setSearch}/>
            {bookingsLoading ? ( 
               <p>Loading bookings...</p>
            ): filteredBookings.length === 0 ? (
               <p>No previos bookings</p>
            ) : (
               <div>
                  {
                     filteredBookings.map((bookings)=> (
                        <BookingCardCustomer  
                        key={bookings.id} 
                        id={bookings.id}
                        date={bookings.date}
                        status={bookings.status}
                        description={bookings.description}
                        service={bookings.technician.service.name}
                        technician={{
                         id: bookings.technician.id,
                         name: bookings.technician.user.name,
                         email: bookings.technician.user.email,
                         city: bookings.technician.user.city,
                         address: bookings.technician.user.address, }}
                        onCancel={() => handleCancelClick(bookings.id)}
                        reviewExists={!!bookings.review}
                         />
                     ))}
               </div>
            )}
         </div>
         {showConfirmModal && (
            <BookingCancelModal onConfirm={confirmCancel} 
            onClose={() =>setShowConfirmModal(false)}/>
         )}
      </div>
   )
}