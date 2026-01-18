"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, X, Truck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceiptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [showTrack, setShowTrack] = useState(false);

  useEffect(() => {
    if (orderId) {
      console.log("Fetching order with ID:", orderId);
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.order);
          } else {
            alert('Order not found');
          }
        })
        .catch(err => alert('Error fetching order'));
    }
  }, [orderId]);

  const refreshOrder = () => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.order);
        }
      });
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFD54F] font-sans p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] p-8 shadow-xl text-center max-w-md"
      >
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-black text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-500 mt-2">Order ID: {order._id}</p>
        <p className="text-gray-500">Total: ₹{order.total}</p>
        <button
          onClick={() => setShowTrack(true)}
          className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold"
        >
          Track Order
        </button>
        <button
          onClick={() => router.push('/')}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto"
        >
          Back to Home <ArrowRight size={20} />
        </button>
      </motion.div>
      
      <AnimatePresence>
        {showTrack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTrack(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              // FIX: Added 'text-black' here to force dark text on the white background
              className="bg-white rounded-2xl p-6 max-w-md w-full text-black" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-gray-900">Order Tracking</h2>
                <button onClick={() => setShowTrack(false)} className="text-gray-500 hover:text-black">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 text-gray-800">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p className="flex items-center gap-2">
                    <strong>Status:</strong> 
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold text-sm">
                        {order.status}
                    </span>
                </p>
                {order.status === "PICKED_UP" && (
                  <p><strong>Delivery OTP:</strong> <span className="font-mono text-2xl font-black text-red-600">{order.otp}</span></p>
                )}
                <p><strong>Total:</strong> ₹{order.total}</p>
                <div>
                  <strong>Items:</strong>
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                    {order.cart.map((item, idx) => (
                      <li key={idx}>{item.name} (x{item.qty}) - ₹{item.price * item.qty}</li>
                    ))}
                  </ul>
                </div>
                {order.deliveryPartner && (
                  <p><strong>Delivery Partner:</strong> {order.deliveryPartner}</p>
                )}
              </div>
              <button
                onClick={refreshOrder}
                className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-green-600"
              >
                <RefreshCw size={16} /> Refresh Status
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}