"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, Utensils, Coffee, Info } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function VenueSelection() {
    const params = useParams();
    const router = useRouter();
    const collegeName = params.college?.toUpperCase() || "CAMPUS";

    const [isExiting, setIsExiting] = useState(false);

    let venues = []

    if (params.college === "dtu") {
        venues = [
            { id: 'canteen', name: 'CANTEEN', type: 'Canteen', img: '/places/canteen.jpeg' },
            { id: 'bistro', name: 'BISTRO', type: 'Cafe', img: '/places/bistro.jpeg' },
            { id: 'dominos', name: 'DOMINOS', type: 'Food Court', img: '/places/dominos.jpeg' },
            { id: 'dazzledine', name: 'DAZZLEDINE', type: 'Canteen', img: '/places/dazzledine.jpeg' },
            { id: 'hims', name: 'HIMS', type: 'Food Court', img: '/places/hims.jpeg' },
            { id: 'deltech', name: 'DELTECH', type: 'Bakery', img: '/places/deltech.jpeg' },
            { id: 'nescafe', name: 'NESCAFE', type: 'Coffee', img: '/places/nescafe.jpeg' },
            { id: 'juice', name: 'JUICE CORNER', type: 'Drinks', img: '/places/juicecorner.jpeg' },
            { id: 'reddy', name: 'REDDY', type: 'South Indian', img: '/places/reddy.jpeg' },
        ]
    }
    else if (params.college === "nsut") {
        venues = [
            { id: 'main-canteen', name: 'MAIN CANTEEN', type: 'Canteen', img: '/places/nsut-canteen.jpeg' },
            { id: 'food-hub', name: 'FOOD HUB', type: 'Food Court', img: '/places/nsut-foodhub.jpeg' },
        ]
    }
    else if (params.college === "igdtuw") {
        venues = [
            { id: 'main-canteen', name: 'MAIN CANTEEN', type: 'Canteen', img: '/places/t-canteen.jpeg' },
            { id: 'food-hub', name: 'FOOD HUB', type: 'Food Court', img: '/places/ns-foodhub.jpeg' },
        ]
    }
    else {
        venues = [
            { id: 'main-canteen', name: 'MAIN CANTEEN', type: 'Canteen', img: '/places/iiit-canteen.jpeg' },
            { id: 'food-hub', name: 'FOOD HUB', type: 'Food Court', img: '/places/iiit-foodhub.jpeg' },
        ]
    }

    const handleVenueSelect = (venueId) => {
        setIsExiting(true);
        setTimeout(() => {
            router.push(`/${params.college}/${venueId}`);
        }, 600);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#FFD54F] overflow-hidden font-sans">

            {/* --- LEFT SIDE: COLLEGE VIBE --- */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden md:flex md:w-1/2 relative bg-black items-center justify-center p-12 overflow-hidden"
            >
                {/* College Image with Overlay */}
                <div
                    className="absolute inset-0 opacity-60 bg-center transition-transform duration-[10s] hover:scale-110"
                    style={{ backgroundImage: `url('/places/DTU-OAT.png')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                <div className="relative z-10 text-white">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="bg-red-600 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">Premium Campus</span>
                        <h1 className="text-7xl font-black italic mt-4 tracking-tighter">{collegeName}</h1>
                        <p className="text-xl font-medium text-gray-300 mt-2">Pick a spot, we&apos;ll find you.</p>
                    </motion.div>
                </div>

                {/* Floating Bubble Background Elements (Left Side Only) */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
                            transition={{ duration: 5 + i, repeat: Infinity }}
                            className="absolute w-24 h-24 rounded-full bg-white/10 blur-xl"
                            style={{ top: `${20 * i}%`, left: `${15 * i}%` }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* --- RIGHT SIDE: VENUE SELECTION --- */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 bg-white md:rounded-[4rem] m-2 shadow-2xl relative z-20 flex flex-col p-6 md:p-8"
            >
                <header className="flex items-center justify-between mb-8">
                    <button onClick={() => router.back()} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-gray-900 leading-none tracking-tighter uppercase">{collegeName}</h2>
                        <p className="text-red-500 font-bold text-xs tracking-widest mt-1">AVAILABLE VENUES</p>
                    </div>
                </header>

                {/* Venue Grid */}
                <div className="flex-1 pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <AnimatePresence>
                            {!isExiting && venues.map((venue, idx) => (
                                <motion.button
                                    key={venue.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleVenueSelect(venue.id)}
                                    className="group relative flex flex-col bg-gray-50 rounded-[2rem] overflow-hidden border border-transparent hover:border-red-500 transition-all shadow-sm hover:shadow-xl"
                                >
                                    {/* Venue Image */}
                                    <div className="h-32 w-full overflow-hidden relative">
                                        <img src={venue.img} alt={venue.name} className="w-full h-full object-top transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-gray-800">
                                            {venue.type}
                                        </div>
                                    </div>

                                    {/* Venue Info */}
                                    <div className="p-4 text-center">
                                        <h3 className="font-black text-gray-900 text-sm leading-tight uppercase tracking-tight">
                                            {venue.name}
                                        </h3>
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Tip */}
                <div className="p-4 bg-yellow-50 mt-3 rounded-2xl border border-yellow-200 flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 rounded-xl text-yellow-900">
                        <Info size={18} />
                    </div>
                    <p className="text-xs font-bold text-yellow-800 italic">
                        &quot;Meet delivery boy at the desired location.&quot;
                    </p>
                </div>
            </motion.div>
        </div>
    );
}