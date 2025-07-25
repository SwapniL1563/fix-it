"use client"

import axios from "axios";
import { useEffect, useState } from "react"

interface Technician {
   id:string,
   bio:string,
   verified:boolean,
   user:{
      name:string,
      email:string,
      city:string,
   },
   service:{
      name:string
   }
}

interface Services {
   name:string,
   id:string,
}

export default function CustomerDashboard(){
   const [technicians,setTechnician] = useState<Technician[]>([]);
   const [services,setServices] = useState<Services[]>([]);
   const [filters,setFilters] = useState({serviceId:"",city:""});
   const [loading,setLoading] = useState(false);

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
   },[])
   return (
      <div>
         <h1>Customer Dashboard</h1>

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
                           <p>{item.bio}</p>
                        </div>

                        <button>Book appointment</button>
                     </div>
                  ))}
               </div>
            )
         }
      </div>
   )
}