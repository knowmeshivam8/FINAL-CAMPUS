"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Bike, ArrowRight, Check, University, X } from 'lucide-react'; // Add X for the popup

export default function SelectRole() {
    const router = useRouter();
    const [selected, setSelected] = useState(null);
    const [isExiting, setIsExiting] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const roles = [
        { id: 'customer', name: "Customer", description: "Order food and items", icon: <ShoppingBag className="w-8 h-8" /> },
        { id: 'delivery', name: "Delivery Partner", description: "Deliver orders on campus", icon: <Bike className="w-8 h-8" /> },
    ];

    const handleContinue = async () => {
        if (selected) {
            if (selected === 'delivery') {
                const phone = localStorage.getItem('phone');
                if (!phone) {
                    setPopupMessage('Phone not found. Please sign in again.');
                    return;
                }
                // Check verification
                const res = await fetch('/api/check-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                const data = await res.json();
                if (!data.verified) {
                    setPopupMessage('You are not verified as a delivery partner. Contact support for approval.');
                    return;
                }
            }
            localStorage.setItem('role', selected);
            setIsExiting(true);
            setTimeout(() => {
                router.push(selected === 'delivery' ? '/delivery-home' : '/home');
            }, 800);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFD54F] overflow-hidden relative font-sans p-4">
            {/* Floating Bubble Background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "120vh", x: Math.random() * 100 + "vw" }}
                        animate={{
                            y: "-20vh",
                            x: [null, (Math.random() - 0.5) * 200 + "px"]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.8
                        }}
                        className="absolute opacity-30"
                    >
                        <div className="w-12 h-12 bg-white rounded-full blur-sm shadow-xl flex items-center justify-center">
                            <University size={20} className="text-orange-500" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {!isExiting && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                        className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] p-8 z-10 border border-white"
                    >
                        <div className="text-center mb-10">
                            <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-3xl font-black tracking-widest uppercase">
                                SELECT ROLE
                            </span>
                            <p className="text-gray-500 font-medium mt-2">How would you like to use Campus Delivery?</p>
                        </div>

                        {/* ROLE GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            {roles.map((role) => (
                                <motion.button
                                    key={role.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelected(role.id)}
                                    className={`relative p-4 rounded-3xl text-left transition-all border-4 ${selected === role.id
                                            ? 'border-red-500 bg-red-50 ring-4 ring-red-100'
                                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${selected === role.id ? 'bg-red-500 text-white' : 'bg-white text-gray-400'
                                        }`}>
                                        {role.icon}
                                    </div>
                                    <h3 className="font-black text-gray-900 text-lg uppercase leading-tight">
                                        {role.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm font-bold">{role.description}</p>
                                    {selected === role.id && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1">
                                            <Check size={16} strokeWidth={4} />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* CONTINUE BUTTON */}
                        <motion.button
                            disabled={!selected}
                            onClick={handleContinue}
                            whileHover={selected ? { scale: 1.02, backgroundColor: '#dc2626' } : {}}
                            whileTap={selected ? { scale: 0.98 } : {}}
                            className={`w-full py-4 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${selected
                                    ? 'bg-red-600 text-white shadow-red-200 cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            CONTINUE <ArrowRight size={24} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* POPUP MESSAGE */}
            <AnimatePresence>
                {popupMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm text-center">
                            <X size={24} className="text-red-500 mx-auto mb-4" />
                            <p className="text-gray-800 font-bold">{popupMessage}</p>
                            <button
                                onClick={() => setPopupMessage('')}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl font-bold"
                            >
                                OK
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}