import React from "react";
import { Calendar, GraduationCap, Newspaper, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import Footer from "@/components/webComponents/Essentials/Footer";
function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8 ">
        <div className="mx-auto max-w-6xl mt-24">
          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="relative text-center mb-12 overflow-hidden rounded-lg shadow-xl">
              {/* Background Image */}
              <div className="relative w-full h-96">
                <img
                  src="/download.jpeg"
                  alt="Alumni background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="relative z-10 py-16 px-6 bg-gradient-to-r from-blue-500/50 to-purple-600/50 text-white h-96">
                  <h1 className="text-4xl font-bold mb-4">
                    Welcome Back, Alumni!
                  </h1>
                  <p className="text-xl text-blue-100 mb-6">
                    Stay connected, get involved, and make a difference.
                  </p>
                  
                </div>
              </div>

              {/* Content Section */}
            </section>

            {/* Upcoming Events */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Annual Homecoming",
                    date: "October 15, 2025",
                    description:
                      "Join us for a weekend of nostalgia and celebration!",
                  },
                  {
                    title: "Career Networking Night",
                    date: "November 5, 2025",
                    description:
                      "Connect with fellow alumni and expand your professional network.",
                  },
                  {
                    title: "Alumni Volunteer Day",
                    date: "December 1, 2025",
                    description:
                      "Give back to the community and make a positive impact together.",
                  },
                ].map((event, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{event.description}</p>
                      <Button variant="outline" className="mt-4">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Latest News */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "New Scholarship Fund Established",
                    date: "July 1, 2025",
                    excerpt:
                      "Thanks to generous alumni donations, we've established a new scholarship fund to support underprivileged students.",
                  },
                  {
                    title: "Alumni Spotlight: Jane Doe's Tech Innovation",
                    date: "June 15, 2025",
                    excerpt:
                      "Alumna Jane Doe ('15) has been recognized for her groundbreaking work in artificial intelligence.",
                  },
                ].map((news, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{news.title}</CardTitle>
                      <CardDescription>{news.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{news.excerpt}</p>
                      <Button variant="link" className="mt-2 p-0">
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Alumni Directory", icon: Users },
                  { title: "Mentorship Program", icon: GraduationCap },
                  { title: "Campus News", icon: Newspaper },
                  { title: "Event Calendar", icon: Calendar },
                ].map((link, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <link.icon className="mx-auto mb-2" size={24} />
                      <h3 className="font-semibold">{link.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
