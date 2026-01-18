"use client"

import Link from "next/link"

import { motion } from "framer-motion"
import { ChevronLeft, User, MapPin, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DetailsPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [landmark, setLandmark] = useState("")

  const handleContinue = () => {
    if (!name || !address) return
    console.log('Details:', { name, address, landmark }); // Add this
    localStorage.setItem("delivery_details", JSON.stringify({ name, address, landmark }));
    console.log('Details set in localStorage:', localStorage.getItem('delivery_details')); // Add this
    router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-[#FFD54F] font-sans">
      {/* HEADER */}
      <header className="py-4 px-6 flex items-center justify-between sticky top-0 bg-[#FFD54F] z-30">
        <button
          onClick={() => router.back()}
          className="bg-white text-black p-3 rounded-2xl shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-black text-2xl uppercase text-[#774f14] italic tracking-tighter">
          DELIVERY DETAILS
        </h1>
        <div className="w-12" />
      </header>

      {/* FORM */}
      <main className="px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-xl rounded-[2.5rem] p-6 shadow-xl border border-white"
        >
          <div className="flex items-center gap-2 mb-6">
            <User className="text-red-500" size={20} />
            <h2 className="font-black uppercase tracking-tight text-gray-900">
              Receiver Info
            </h2>
          </div>

          <div className="space-y-4">
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-2xl border px-4 py-3 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hostel / Flat / Room Address"
              rows={3}
              className="w-full rounded-2xl border px-4 text-black  py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />

            <input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby Landmark (optional)"
              className="w-full rounded-2xl border px-4 text-black py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* NOTE */}
          <div className="flex items-start gap-2 mt-5 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md">
            <Info size={16} className="mt-0.5" />
            <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
              Accurate details help faster campus delivery
            </p>
          </div>
          

          {/* CONTINUE */}
           
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              disabled={!name || !address}
              className="w-[70%] mt-6 py-3 rounded-[2.5rem] bg-black text-white font-black text-lg shadow-2xl disabled:opacity-40"
            >
              CONTINUE →
            </motion.button>
          </div>
          
        </motion.div>
      </main>
    </div>
  )
}
