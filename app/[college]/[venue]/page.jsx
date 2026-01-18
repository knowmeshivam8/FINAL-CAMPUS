"use client";

import React, { useState, useMemo, useEffect } from 'react';
import itemdata from '@/Public/items.json'
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Plus, Minus, Star } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function VenueMenu() {
  const params = useParams();
  const venue = params.venue?.toUpperCase();
  const router = useRouter();
  const [cart, setCart] = useState({}); // { itemId: quantity }

  const collegeParam = params.college; // 'dtu'
  const venueParam = params.venue; // 'canteen'

  // Fetch menu data based on college and venue from the imported JSON
  const MENU_DATA = useMemo(() => { 
    const collegeObj = itemdata.find(c => c.id === collegeParam); 
    const venueObj = collegeObj?.venues.find(v => v.name.toLowerCase() === venueParam);

    return { 
      categories: venueObj?.categories || [],
      items: venueObj?.items || []
    };
  }, [collegeParam, venueParam]);

  const [activeCat, setActiveCat] = useState("");

  useEffect(() => {
    if (MENU_DATA.categories.length > 0 && !activeCat) {
      setActiveCat(MENU_DATA.categories[0]);
    }
  }, [MENU_DATA, activeCat]);

  const { totalItems, totalPrice, cartDetails } = useMemo(() => {
    const details = Object.entries(cart).map(([id, qty]) => {
      const item = MENU_DATA.items.find(i => i.id === parseInt(id));
      return item ? { ...item, qty } : null;
    }).filter(Boolean); // Clean up any nulls

    const totals = details.reduce((acc, item) => ({
      totalItems: acc.totalItems + item.qty,
      totalPrice: acc.totalPrice + (item.price * item.qty)
    }), { totalItems: 0, totalPrice: 0 });

    return { ...totals, cartDetails: details };
  }, [cart, MENU_DATA]); 


  // 2. CHECKOUT HANDLER: Save to localStorage and redirect
  const handleCheckout = () => {
    if (totalItems > 0) {
      localStorage.setItem('campus_cart', JSON.stringify(cartDetails));
      localStorage.setItem('campus_total', totalPrice.toString());
      localStorage.setItem('selectedCollege', collegeParam); // Add this
      localStorage.setItem('selectedVenue', venueParam); // Add this
      router.push('/details');
    }
  };

  const updateCart = (id, delta) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const filteredItems = MENU_DATA.items.filter(item => item.category === activeCat);

  return (
    <div className="w-full min-h-screen bg-[#FFD54F] font-sans">
      {/* HEADER */}
      <header className="py-4 px-6 flex items-center justify-between sticky top-0 bg-[#FFD54F] z-30">
        <button onClick={() => router.back()} className="bg-white p-3 text-gray-500 rounded-2xl shadow-lg">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="font-black text-3xl uppercase italic tracking-tighter">{venue}</h1>
          <p className="text-[14px] font-bold text-red-600 tracking-widest uppercase">Menu Selection</p>
        </div>
        <div className="w-12" />
      </header>

      <div className="bg-white m-2 md:mx-6 rounded-t-[3rem] min-h-[calc(100vh-100px)] p-4 md:p-6 pb-32">
        {/* CATEGORY SELECTOR */}
        <div className="flex gap-3 pl-3 overflow-x-auto pb-6 no-scrollbar">
          {MENU_DATA.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-3 rounded-2xl font-black text-xs whitespace-nowrap transition-all ${
                activeCat === cat ? 'bg-black text-white scale-105 shadow-xl' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ITEMS LIST */}
        <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-4 bg-gray-50 p-2 md:p-4 rounded-[2rem] border border-transparent hover:border-yellow-200 transition-all"
              >
                <img src={item.img} alt={item.name} className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-cover shadow-md" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-bold">{item.rating}</span>
                  </div>
                  <h3 className="font-black text-gray-900 leading-tight uppercase text-sm mb-1">{item.name}</h3>
                  <p className="font-bold text-red-600 text-lg">₹{item.price}</p>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="flex flex-row items-center gap-2 md:flex-col bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => updateCart(item.id, 1)}
                    className="p-2 bg-yellow-400 rounded-xl text-black"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </motion.button>
                  
                  <span className={`font-black ${cart[item.id] ? 'text-black' : 'text-gray-200'} text-sm w-6 text-center`}>
                    {cart[item.id] || 0}
                  </span>

                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => updateCart(item.id, -1)}
                    disabled={!cart[item.id]}
                    className={`p-2 rounded-xl transition-colors ${cart[item.id] ? 'bg-gray-100 text-black' : 'text-gray-200'}`}
                  >
                    <Minus size={18} strokeWidth={3} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 w-full md:w-1/2 md:left-1/4 px-4 z-50"
          >
            <div className="bg-black rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl border border-white/10">
              <div className="flex items-center gap-4 pl-4">
                <div className="relative">
                  <ShoppingBag className="text-white" size={28} />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase">Total Amount</p>
                  <p className="text-white text-xl font-black italic">₹{totalPrice}</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="bg-red-600 text-white px-8 py-4 rounded-[1.8rem] font-black text-sm tracking-tight hover:bg-red-700 transition-colors"
              >
                CHECKOUT
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}