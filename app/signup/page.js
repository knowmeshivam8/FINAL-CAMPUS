"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Bike, ArrowRight, MapPin, Clock, Star } from 'lucide-react';

export default function SignupForm() {
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        email: '',
        gender: '',
        // role: ''
    });
    const [isExiting, setIsExiting] = useState(false);

    const handleSubmit = (e) => {
    e.preventDefault();
    setIsExiting(true);
    console.log('Signup formData:', formData); // Add this
    localStorage.setItem('phone', formData.number);
    localStorage.setItem('role', formData.role || 'customer');
    console.log('Phone and role set:', localStorage.getItem('phone'), localStorage.getItem('role')); // Add this
    setTimeout(() => {
        window.location.href = "/home";
    }, 600);
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const floatingVariant = {
        animate: (i) => ({
            // Random wandering path
            x: [0, Math.random() * 100 - 50, Math.random() * -100 + 50, 0],
            y: [0, Math.random() * -150 - 50, Math.random() * -300 - 100, -500],
            opacity: [0.5, 0.8, 0.8, 0.5],
            scale: [1, 1.2, 0.8, 1.1],
            transition: {
                duration: 15 + Math.random() * 10, // Different speeds
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
            }
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ecd75c] p-6 font-sans">

            {/* 1. Mesh Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/30 via-transparent to-red-500/20 pointer-events-none" />
            {/* 2. Floating Glassmorphic "Status" Chips */}
            <motion.div custom={1} variants={floatingVariant} initial="initial" animate="animate"
                className="absolute top-[15%] left-[10%] hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold text-sm shadow-xl">
                <Clock size={16} /> Fast Delivery
            </motion.div>
            <motion.div custom={2} variants={floatingVariant} initial="initial" animate="animate"
                className="absolute bottom-[20%] left-[15%] hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold text-sm shadow-xl">
                <MapPin size={16} /> Campus Wide
            </motion.div>
            <motion.div custom={3} variants={floatingVariant} initial="initial" animate="animate"
                className="absolute top-[20%] right-[10%] hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold text-sm shadow-xl">
                <Star size={16} className="fill-white" /> 4.9 Rating
            </motion.div>
            {/* 3. Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <AnimatePresence>
                {!isExiting && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-10 z-10 border border-white"
                    >
                        <header className="mb-8 text-center">
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight italic">CAMPUS DELIVERY</h2>
                            <div className="h-1 w-12 bg-red-500 mx-auto mt-1 rounded-full" />
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest flex items-center gap-2">
                                    <User size={14} /> NAME
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl px-5 py-3.5 outline-none text-black focus:ring-2 focus:ring-red-500 transition-all text-center font-medium"
                                    onChange={(e) => updateField('name', e.target.value)}
                                />
                            </div>

                            {/* Number Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest flex items-center gap-2">
                                    <Phone size={14} /> NUMBER
                                </label>
                                <input
                                    type="tel"
                                    required
                                    maxLength={10}
                                    placeholder="Enter phone number"
                                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl px-5 py-3.5 outline-none text-black focus:ring-2 focus:ring-red-500 transition-all text-center font-medium"
                                    onChange={(e) => updateField('number', e.target.value)}
                                />
                            </div>

                            {/* Gender Selection */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest">GENDER</label>
                                <div className="flex gap-3">
                                    {['MALE', 'FEMALE'].map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => updateField('gender', option)}
                                            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${formData.gender === option
                                                ? 'bg-yellow-400 text-gray-900 shadow-md transform scale-[1.02]'
                                                : 'bg-white ring-1 ring-gray-200 text-gray-400 hover:bg-gray-50'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest flex items-center gap-2">
                                    <Mail size={14} /> EMAIL ID
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Email address"
                                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 rounded-2xl px-5 py-3.5 outline-none text-black focus:ring-2 focus:ring-red-500 transition-all text-center font-medium"
                                    onChange={(e) => updateField('email', e.target.value)}
                                />
                            </div>

                            {/* Role Selection */}
                            {/* <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 ml-2 tracking-widest text-center block">APPLY AS A</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'CUSTOMER', icon: ShoppingBag },
                                        { id: 'DELIVERY BOY', icon: Bike }
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => updateField('role', role.id)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all border-2 ${formData.role === role.id
                                                    ? 'border-red-500 bg-red-50 text-red-600'
                                                    : 'border-transparent bg-gray-50 text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            <role.icon size={20} className="mb-1" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{role.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div> */}

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-red-600 text-white font-black py-4 rounded-2xl mt-4 shadow-lg shadow-red-200 flex items-center justify-center gap-2 group transition-all"
                            >
                                CONTINUE
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}