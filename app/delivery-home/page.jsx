"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bike,
  ArrowLeft,
  CheckCircle,
  Truck,
  MapPin,
  User,
  IndianRupee,
  Bell,
} from "lucide-react";
import {
  checkPermissionStateAndAct,
  notificationUnsupported,
  registerAndSubscribe,
} from "@/lib/push.js";

export default function DeliveryHome() {
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [otps, setOtps] = useState({});
  const phone =
    typeof window !== "undefined"
      ? localStorage.getItem("phone") || "919876543210"
      : "919876543210";

  useEffect(() => {
    fetch("/api/orders/pending")
      .then((res) => res.json())
      .then((data) => data.success && setPendingOrders(data.orders));

    fetch(`/api/orders/accepted?phone=${phone}`)
      .then((res) => res.json())
      .then((data) => data.success && setAcceptedOrders(data.orders));
  }, [phone]);

  const handleAccept = async (orderId) => {
    const res = await fetch("/api/orders/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        status: "ACCEPTED",
        deliveryPartner: phone,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setPendingOrders(pendingOrders.filter((o) => o._id !== orderId));
      setAcceptedOrders([...acceptedOrders, data.order]);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, otp = null) => {
    const body = { orderId, status: newStatus }
    if (otp) body.otp = otp
    const res = await fetch("/api/orders/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      setAcceptedOrders(
        acceptedOrders.map((o) => (o._id === orderId ? data.order : o))
      );
      setOtps({...otps, [orderId]: ''});
    } else {
      alert(data.message || "Error updating status");
    }
  };

  const [unsupported, setUnsupported] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const isUnsupported = notificationUnsupported();
    setUnsupported(isUnsupported);
    if (isUnsupported) {
      return;
    }
    checkPermissionStateAndAct(setSubscription);
  }, []);

  const handleSubscription = async () => {
    if (unsupported) {
      alert("Browser doesn't support Notifications");
      return;
    }
    registerAndSubscribe(setSubscription);
  };

  return (
    <div className="min-h-screen bg-[#FFD54F] font-sans p-4 text-black">
      <header className="p-4 flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="bg-white p-4 rounded-2xl shadow-xl border-2 border-black"
        >
          <ArrowLeft size={28} strokeWidth={3} />
        </button>
        <h1 className="font-black text-3xl uppercase italic tracking-tighter">
          Delivery Panel
        </h1>
        <div className="flex gap-2 justify-center items-center">
          <div className="bg-black p-2 rounded-lg">
            <Bike size={28} className="text-[#FFD54F]" />
          </div>
          <div
            className={`bg-black p-2 rounded-lg ${unsupported ? "hidden" : ""}`}
          >
            <Bell
              size={28}
              className="text-[#FFD54F]"
              onClick={handleSubscription}
            />
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {/* Pending Orders */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-black">
          <h2 className="font-black text-2xl mb-6 border-b-4 border-black pb-2 inline-block">
            NEW ORDERS
          </h2>
          {pendingOrders.length === 0 ? (
            <p className="text-gray-600 font-bold text-lg italic">
              No pending orders right now.
            </p>
          ) : (
            pendingOrders.map((order) => (
              <div
                key={order._id}
                className="border-b-2 border-gray-200 pb-6 mb-6 last:border-0"
              >
                <div className="space-y-3">
                  <p className="text-xl leading-tight">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Customer:
                    </strong>{" "}
                    <span className="font-black text-2xl">{order.name}</span>
                  </p>
                  <p className="text-xl leading-tight">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Address:
                    </strong>{" "}
                    <span className="font-bold">{order.address?.address}</span>
                  </p>
                  <p className="text-2xl font-black text-green-700 mt-2 flex items-center">
                    <IndianRupee size={20} strokeWidth={3} /> {order.total}
                  </p>
                  <p className="text-xl leading-tight">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Venue:
                    </strong>{" "}
                    <span className="font-bold">
                      {order.venue} at {order.college}
                    </span>
                  </p>
                  <p className="text-xl leading-tight">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Items:
                    </strong>{" "}
                    <span className="font-bold">
                      {order.cart
                        .map((item) => `${item.name} (x${item.qty})`)
                        .join(", ")}
                    </span>
                  </p>
                  <p className="text-xl leading-tight">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Payment Method:
                    </strong>{" "}
                    <span className="font-bold">{order.paymentMethod}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleAccept(order._id)}
                  className="w-full mt-4 bg-black text-white text-xl font-black py-5 rounded-2xl active:scale-95 transition-transform"
                >
                  ACCEPT ORDER
                </button>
              </div>
            ))
          )}
        </div>

        {/* Accepted Orders */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-black">
          <h2 className="font-black text-2xl mb-6 border-b-4 border-black pb-2 inline-block">
            ACTIVE TASKS
          </h2>
          {acceptedOrders.length === 0 ? (
            <p className="text-gray-600 font-bold text-lg italic">
              No active orders.
            </p>
          ) : (
            acceptedOrders.map((order) => (
              <div
                key={order._id}
                className="border-b-2 border-gray-200 pb-6 mb-6 last:border-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-black text-sm border-2 border-blue-900">
                    {order.status}
                  </span>
                  <p className="font-mono font-black text-gray-400 text-sm">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-xl">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Deliver To:
                    </strong>{" "}
                    <span className="font-black text-2xl">{order.name}</span>
                  </p>
                  <p className="text-xl">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Address:
                    </strong>{" "}
                    <span className="font-bold">{order.address?.address}</span>
                  </p>
                  <p className="text-xl">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Venue:
                    </strong>{" "}
                    <span className="font-bold">
                      {order.venue} at {order.college}
                    </span>
                  </p>
                  <p className="text-xl">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Items:
                    </strong>{" "}
                    <span className="font-bold">
                      {order.cart
                        .map((item) => `${item.name} (x${item.qty})`)
                        .join(", ")}
                    </span>
                  </p>
                  <p className="text-xl leading-tight">
                    <strong className="font-black uppercase text-sm block text-gray-500">
                      Payment Method:
                    </strong>{" "}
                    <span className="font-bold">{order.paymentMethod}</span>
                  </p>
                </div>

                {order.status === "ACCEPTED" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "PICKED_UP")}
                    className="w-full bg-blue-600 text-white text-xl font-black py-5 rounded-2xl shadow-lg"
                  >
                    CONFIRM PICKED UP
                  </button>
                )}
                {order.status === "PICKED_UP" && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP from customer"
                      value={otps[order._id] || ''}
                      onChange={(e) => setOtps({...otps, [order._id]: e.target.value})}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl font-bold text-center text-xl"
                      maxLength="4"
                    />
                    <button
                      onClick={() => handleUpdateStatus(order._id, "DELIVERED", otps[order._id])}
                      className="w-full bg-green-600 text-white text-xl font-black py-5 rounded-2xl shadow-lg"
                    >
                      VERIFY & DELIVER
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}