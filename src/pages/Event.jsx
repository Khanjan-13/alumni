import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Calendar } from "lucide-react"


const events = [
  {
    id: 1,
    title: "BVM Class 1981 - Alumni Retreat, 2025",
    image: "https://almashines.s3.dualstack.ap-southeast-1.amazonaws.com/assets/images/eventlogos/sizea/7462251734947991.jpg",
    startDate: "Jan 06, 2025",
    endDate: "Jan 08, 2025",
    location: "Polo forest",
    isPast: true,
  },
  {
    id: 2,
    title: "62nd Annual General Meeting",
    image: "https://almashines.s3.dualstack.ap-southeast-1.amazonaws.com/assets/images/eventlogos/sizea/7462251731727423.jpg",
    startDate: "Jan 04, 2025",
    time: "3:00 PM",
    location: "V&C Patel English Medium School, Vallabh Vidyanagar",
    isPast: true,
  },
];


function Event() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 ">
    <div className="mx-auto max-w-6xl">
      
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mt-24" >
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by title..." className="pl-10" />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">EVENT CATEGORIES</h2>

              <div className="space-y-2">
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
                  <span>All Events</span>
                  <span className="text-gray-500">(49)</span>
                </div>
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
                  <span>Past Events</span>
                  <span className="text-gray-500">(49)</span>
                </div>
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
                  <span>Upcoming Events</span>
                  <span className="text-gray-500">(0)</span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">Categories</h3>
                <div className="flex justify-between items-center p-3">
                  <span>BVM US G2G meets</span>
                  <span className="text-gray-500">(2)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden rounded-none">
                <CardContent className="p-0 h-52">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={400}
                        height={250}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">{event.title}</h3>
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Starts: {event.startDate}
                                {event.endDate && ` Ends: ${event.endDate}`}
                                {event.time && ` - ${event.time}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                       
                      </div>
                      <div className="flex justify-between items-center p-3">
                          <span className="rounded-full bg-gray-200 px-3 py-1 text-sm">Past Event</span>
                          <Button className="bg-blue-600 hover:bg-blue-700 rounded-sm">VIEW</Button>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Event
