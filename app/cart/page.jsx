"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Wallet,
  Truck,
  Receipt,
  CheckCircle2,
  Plus,
  Minus,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({});
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [form, setForm] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (form && formRef.current) {
      const form = formRef.current.querySelector("form");
      if (form) {
        form.submit();
      }
    }
  }, [form]);

  // FIX: Move all localStorage reading into a single useEffect
  useEffect(() => {
    // 1. Get Delivery Details
    const details = localStorage.getItem("delivery_details");
    if (details) setDeliveryDetails(JSON.parse(details));

    // 2. Get College and Venue
    const college = localStorage.getItem("selectedCollege");
    const venue = localStorage.getItem("selectedVenue");
    if (college) setSelectedCollege(college);
    if (venue) setSelectedVenue(venue);

    // 3. Get Cart Items
    const savedCart = localStorage.getItem("campus_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      router.push("/"); // Redirect if empty
    }
  }, [router]);
  const deliveryFee = 10;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const total = subtotal + deliveryFee;

  const updateQty = (id, delta) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
      )
      .filter((item) => item.qty > 0);

    setCartItems(updated);
    localStorage.setItem("campus_cart", JSON.stringify(updated));
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    const phone = localStorage.getItem("phone");
    console.log("PayNow - Phone:", phone, "Details:", deliveryDetails);
    if (!phone || !deliveryDetails.name) {
      alert("Missing user or delivery details");
      setIsProcessing(false);
      return;
    }

    const orderData = {
      userId: phone,
      phone,
      name: deliveryDetails.name,
      address: { ...deliveryDetails },
      cart: cartItems,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      college: selectedCollege,
      venue: selectedVenue,
    };

    try {
      const res = await fetch("/api/Create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("campus_cart");
        localStorage.removeItem("delivery_details");

        const res = await fetch("/api/payment-gateway/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            amount: total,
            firstName: deliveryDetails.name,
            // ! ask for your email address
            email: "test@gmail.com",
            phone: phone.slice(3),
            address: `${deliveryDetails.address}, ${deliveryDetails.landmark}`,
            pg: paymentMethod,
          }),
        });
        const redirectTOPaymentGateway = await res.json();

        if (redirectTOPaymentGateway.success) {
          setForm(redirectTOPaymentGateway.form);
        } else {
          alert("Payment Couldn't be initiated");
        }
      } else {
        alert("Order failed");
      }
    } catch (error) {
      console.log(error);
      alert("Error creating order");
    }
    setIsProcessing(false);
  };

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
          CART & PAYMENT
        </h1>
        <div className="w-12" />
      </header>

      <main className="px-4 grid grid-cols-1 md:grid-cols-2 space-y-2 gap-2">
        {/* ITEM LIST SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-white"
        >
          <div className="flex items-center gap-2 mb-3 border-b pb-4 border-gray-100">
            <Receipt className="text-red-500" size={20} />
            <h2 className="font-black text-gray-900 uppercase tracking-tight">
              Review Items
            </h2>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 uppercase text-xs">
                      {item.name}
                    </p>
                    <p className="text-xs text-red-600 font-black">
                      ₹{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="font-black text-sm text-gray-900 w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* BILL SUMMARY */}
          <div className="pt-6 border-t border-dashed border-gray-200 space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Truck size={14} /> Delivery Fee
              </span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-gray-900 uppercase pt-2 italic">
              <span>Total Pay</span>
              <span className="text-red-600 font-black">₹{total}</span>
            </div>
          </div>
        </motion.div>

        <div>
          {/* PAYMENT METHODS SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-white"
          >
            <h2 className="font-black text-gray-900 uppercase tracking-tight mb-6">
              Select Payment
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "upi",
                  label: "UPI (GooglePay / PhonePe)",
                  icon: <Wallet size={20} />,
                },
                {
                  id: "creditcard|debitcard",
                  label: "Credit / Debit Card",
                  icon: <CreditCard size={20} />,
                },
                // {
                //   id: "COD",
                //   label: "Cash on Delivery",
                //   icon: <Truck size={20} />,
                // },
              ].map((method) => (
                <label
                  key={method.id}
                  disabled={method.id === "COD"}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    method.id === "COD"
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:grayscale-0 hover:opacity-100"
                  } ${
                    paymentMethod === method.id
                      ? "border-red-500 bg-red-50 ring-2 ring-red-100"
                      : "border-gray-50 bg-gray-200 grayscale opacity-70 "
                  }  
                                        `}
                >
                  <div className={`flex items-center gap-3`}>
                    <div
                      className={
                        paymentMethod === method.id
                          ? "text-red-500"
                          : "text-gray-400"
                      }
                    >
                      {method.icon}
                    </div>
                    <span
                      className={`font-black text-xs uppercase ${
                        paymentMethod === method.id
                          ? "text-red-700"
                          : "text-gray-500"
                      }`}
                    >
                      {method.label}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    className="hidden"
                    onChange={() => setPaymentMethod(method.id)}
                    checked={paymentMethod === method.id}
                  />
                  {paymentMethod === method.id && (
                    <CheckCircle2 className="text-red-500" size={20} />
                  )}
                </label>
              ))}
            </div>
          </motion.div>

          {/* PAY BUTTON */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayNow}
              disabled={isProcessing || cartItems.length === 0}
              className={`w-[70%] py-3 mt-4 rounded-[2.5rem] font-black text-lg shadow-2xl transition-all relative overflow-hidden ${
                isProcessing ? "bg-green-500" : "bg-black text-white"
              }`}
            >
              {isProcessing ? (
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  VERIFYING...
                </motion.div>
              ) : (
                ` • PAY NOW • `
              )}
            </motion.button>
          </div>
        </div>
      </main>
      {/* SAFETY NOTE */}
      <div className="flex mt-5 items-center justify-center gap-2 text-gray-600 bg-black/5 py-3 rounded-2xl">
        <Info size={14} />
        <p className="text-[10px] font-bold uppercase tracking-widest">
          Secure Payment Gateway Active
        </p>
      </div>

      {form && (
        <div dangerouslySetInnerHTML={{ __html: form }} ref={formRef}></div>
      )}
    </div>
  );
}
