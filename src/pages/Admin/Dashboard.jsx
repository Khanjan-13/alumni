import { useState } from "react"
import { BarChart3, Calendar, Cog, GraduationCap, Home, Mail, Menu, MessageSquare, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminNavbar from "./AdminNavbar"
// import { Overview } from "@/components/overview"
// import { RecentAlumni } from "@/components/recent-alumni"
// import { UpcomingEvents } from "@/components/upcoming-events"

export default function Dashboard() {
 

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </header>
        <main className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4,238</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2,845</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">7</div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">$24,580</div>
                <p className="text-xs text-muted-foreground">+18% from last year</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Alumni Engagement</CardTitle>
                <CardDescription>Monthly engagement metrics for the past year</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Overview /> */}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Alumni</CardTitle>
                <CardDescription>Latest alumni who joined the portal</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <RecentAlumni /> */}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events scheduled for the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <UpcomingEvents /> */}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

