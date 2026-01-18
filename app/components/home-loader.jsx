"use client"
import { motion } from "framer-motion"

export default function HomeLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-yellow-300 to-yellow-400 overflow-hidden"
        style={{ backgroundImage: "url('/images/bg-phone.png')" }}>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 mb-8"
            >
                Campus Delivery
            </motion.h1>


            <motion.div className="relative">
                <motion.div
                    className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full border-4 border-yellow-600 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                    }}
                />

                {/* Circular Image */}
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden bg-yellow-200 flex items-center justify-center shadow-xl">
                    <motion.img
                        src="/images/boy.png"
                        alt="Delivery Boy"
                        className="w-full h-full object-cover"
                    />
                </div>
            </motion.div>

            {/* Loading dots */}
            <motion.p
                className="mt-6 text-gray-800 text-lg bold tracking-wide"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
            >
                Delivering happiness...
            </motion.p>
        </div>
    )
}
