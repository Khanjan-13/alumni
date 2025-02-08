import React from 'react'
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                  <p>Email: alumni@bvmengineering.ac.in</p>
                  <p>Phone: +91 99999 00000</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <NavLink href="#" className="hover:text-blue-400">
                      Facebook
                    </NavLink>
                    <NavLink href="#" className="hover:text-blue-400">
                      Twitter
                    </NavLink>
                    <NavLink href="#" className="hover:text-blue-400">
                      LinkedIn
                    </NavLink>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                  <ul className="space-y-1">
                    <li>
                      <NavLink href="#" className="hover:underline">
                        Privacy Policy
                      </NavLink>
                    </li>
                    <li>
                      <NavLink href="#" className="hover:underline">
                        Terms of Service
                      </NavLink>
                    </li>
                    <li>
                      <NavLink href="#" className="hover:underline">
                        Accessibility
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p>&copy; 2025 Alumni Connect. All rights reserved.</p>
              </div>
            </div>
          </footer>
    </>
  )
}

export default Footer
