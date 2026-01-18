"use client"
import { useEffect } from "react"

export default function SignInButton() {
  useEffect(() => {
    // 🔹 load script
    const script = document.createElement("script")
    script.src = "https://www.phone.email/sign_in_button_v1.js"
    script.async = true
    document.body.appendChild(script)

    // 🔹 REQUIRED listener
    window.phoneEmailListener = function (userObj) {
      fetch("/api/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_json_url: userObj.user_json_url
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('phone', data.phone);
            console.log('Phone set in localStorage:', localStorage.getItem('phone')); // Store phone for verification checks
            window.location.href = "/role-selection"
          }
        })
    }

    return () => {
      window.phoneEmailListener = null
    }
  }, [])

  return (
    <div
      className="pe_signin_button"
      data-client-id="11755813962373466753"
    >
      Sign in with Phone
    </div>
  )
}
