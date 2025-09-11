"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FlowLoader from "@/components/loader/FlowLoader";
import clsx from "clsx";

export default function DefaultLandingPage() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    setLoaded(true);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <FlowLoader />;
  }

  const fadeInClass = loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 border-b bg-white shadow-sm z-20">
        <div className="flex items-center px-6 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            <span className="text-green-600">JetFlow</span>
            <span className="text-sky-600">Orchestrator</span>
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center text-center px-6 mt-16">
        {/* Background Image */}
        <Image
          src="/jfo.png"
          alt="Jetflow Background"
          fill
          style={{ objectFit: "contain" }}
          priority
          placeholder="blur"
          blurDataURL="/jfo_blur.png"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-300/70 via-green-400/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto transition-all duration-700 ease-out transform">
          <h2 className={clsx("text-6xl font-extrabold text-black drop-shadow-lg transition-all duration-700", fadeInClass)}>
            Jetflow Orchestrator
          </h2>
          <p className={clsx("mt-4 text-lg text-black transition-all duration-700", fadeInClass)}>
            Build, manage, and orchestrate your workflows seamlessly.<br />
            Powerful, scalable, and developer-friendly.
          </p>

          {/* Cards */}
          <div className={clsx("mt-12 flex flex-wrap justify-center items-start gap-8", fadeInClass)}>
            {[
              {
                title: "Sign up",
                subtitle: "Choose your account type to get started.",
                buttons: [
                  { text: "Individual Account", style: "border border-blue-500 text-blue-500 hover:bg-blue-50 bg-white" },
                  { text: "Organization Account", style: "bg-blue-500 text-white hover:bg-blue-600" },
                ],
              },
              {
                title: "Login",
                subtitle: "",
                inputs: [
                  { label: "Email", type: "email", placeholder: "Enter your email" },
                  { label: "Password", type: "password", placeholder: "Enter your password" },
                ],
                forgot: true,
                primaryButton: { text: "Login", style: "bg-blue-500 text-white hover:bg-blue-600" },
                socialButtons: ["google", "microsoft", "apple"],
              },
            ].map((card, idx) => (
              <div key={idx} className="p-8 w-full md:w-[500px] bg-white rounded-lg shadow-sm transition-all duration-700 transform">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                {card.subtitle && <p className="text-gray-600 mb-6">{card.subtitle}</p>}

                {card.inputs &&
                  card.inputs.map((input, i) => (
                    <div key={i} className="mb-4 align-left">
                      <label className="block text-sm text-left font-bold mb-1 text-gray-700">{input.label}</label>
                      <input
                        type={input.type}
                        placeholder={input.placeholder}
                        className="w-full h-11 px-3 text-sm text-gray-700 border border-gray-300 rounded-md outline-none"
                      />
                    </div>
                  ))}

                {card.forgot && (
                  <div className="mb-4 text-right">
                    <a href="#" className="text-sm text-blue-500 hover:underline font-medium">Forgot password?</a>
                  </div>
                )}

                {card.primaryButton && (
                  <button className={`w-full h-11 flex items-center justify-center font-bold text-sm rounded-md mb-6 ${card.primaryButton.style}`}>
                    {card.primaryButton.text}
                  </button>
                )}

                {card.buttons &&
                  card.buttons.map((btn, i) => (
                    <button key={i} className={`w-full h-11 mb-4 flex items-center justify-center font-bold text-sm rounded-md ${btn.style}`}>
                      {btn.text}
                    </button>
                  ))}

                {card.socialButtons && (
                  <>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-sm text-gray-500">or continue with</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    <div className="flex justify-between gap-4">
                      {card.socialButtons.map((provider) => (
                        <button key={provider} className="flex items-center justify-center gap-2 w-1/3 h-11 border border-gray-300 rounded-md hover:bg-gray-50">
                          <Image src={`/icons/${provider}.svg`} alt={provider} width={20} height={20} />
                          <span className="text-sm font-medium text-gray-700">{provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-2 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="grid grid-cols-3 gap-12">
            {["Product", "Resources", "Company"].map((section) => (
              <div key={section}>
                <a className="text-sm font-semibold text-gray-900 uppercase mb-4">{section}</a>
              </div>
            ))}
          </div>
          <div className="flex gap-6">
            {["github", "linkedin", "youtube"].map((icon) => (
              <a key={icon} href="#" aria-label={icon} className="text-gray-500 hover:text-blue-500">
                <Image src={`/icons/${icon}.svg`} alt={icon} width={24} height={24} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
