import Image from "next/image";

export default function DefaultLandingPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="w-full fixed top-0 left-0 border-b bg-white shadow-sm">
          <div className="flex items-center px-6 py-4">
            {/* Logo */}
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              <span className="text-green-600">JetFlow</span>
              <span className="text-sky-600">Orchestrator</span>
            </h1>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative flex flex-1 items-center justify-center text-center px-6 mt-16">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-80"
            style={{
              backgroundImage:
                "url('/jfo.png')",
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-300/70 via-green/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-6xl font-extrabold text-black drop-shadow-lg">
              Jetflow Orchestrator
            </h2>
            <p className="mt-4 text-lg text-black">
              Build, manage, and orchestrate your workflows seamlessly.<br />
              Powerful, scalable, and developer-friendly.
            </p>

            {/* Cards container */}
            <div className="mt-12 flex flex-wrap justify-center items-start gap-8">
              {/* Sign Up Card */}
              <div
                className="p-8 w-[500px] text-left"
                style={{
                  background: "#FFFFFFFF",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 1px #171a1fDD, 0px 0px 2px #171a1f14",
                }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Sign up
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose your account type to get started.
                </p>

                <button className="w-full h-[44px] mb-4 flex items-center justify-center font-bold text-sm rounded-md border border-[#397BFE] text-[#397BFE] bg-white hover:bg-white">
                  Individual Account
                </button>

                <button className="w-full h-[44px] flex items-center justify-center font-bold text-sm rounded-md bg-[#397BFE] text-white hover:bg-[#0155FD]">
                  Organization Account
                </button>
              </div>

              {/* Login Card */}
              <div
                className="p-8 w-[500px] h-auto text-left"
                style={{
                  background: "#FFFFFFFF",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 1px #171a1fDD, 0px 0px 2px #171a1f14",
                }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Login
                </h3>

                {/* Input 1 */}
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full h-[43px] px-3 text-sm font-normal text-gray-700 border border-[#DEE1E6] rounded-md outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Input 2 */}
                <div className="mb-2">
                  <label className="block text-sm font-bold mb-1 text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full h-[43px] px-3 text-sm font-normal text-gray-700 border border-[#DEE1E6] rounded-md outline-none"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="mb-4 text-right">
                  <a
                    href="#"
                    className="text-sm text-[#397BFE] hover:underline font-medium"
                  >
                    Forgot password?
                  </a>
                </div>

                <button className="w-full h-[44px] flex items-center justify-center font-bold text-sm rounded-md bg-[#397BFE] text-white hover:bg-[#0155FD] mb-6">
                  Login
                </button>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500">or continue with</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="flex justify-between gap-4">
                  <button className="flex items-center justify-center gap-2 w-1/3 h-[44px] border border-gray-300 rounded-md hover:bg-gray-50">
                    <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-700">Google</span>
                  </button>

                  <button className="flex items-center justify-center gap-2 w-1/3 h-[44px] border border-gray-300 rounded-md hover:bg-gray-50">
                    <img
                      src="/icons/microsoft.svg"
                      alt="Microsoft"
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Microsoft
                    </span>
                  </button>

                  <button className="flex items-center justify-center gap-2 w-1/3 h-[44px] border border-gray-300 rounded-md hover:bg-gray-50">
                    <img src="/icons/apple.svg" alt="Apple" className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-700">Apple</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full mt-2">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Left: Links */}
            <div className="grid grid-cols-3 gap-12">
              {/* Product */}
              <div>
                <a className="text-sm font-semibold text-gray-900 uppercase mb-4">Product</a>
              </div>

              {/* Resources */}
              <div>
                <a className="text-sm font-semibold text-gray-900 uppercase mb-4">Resources</a>
              </div>

              {/* Company */}
              <div>
                <a className="text-sm font-semibold text-gray-900 uppercase mb-4">Company</a>
              </div>
            </div>

            {/* Right: Social Icons */}
            <div className="flex gap-6">
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-[#397BFE]">
                <img src="/icons/github.svg" alt="Github" className="w-6 h-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-[#397BFE]">
                <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-500 hover:text-[#397BFE]">
                <img src="/icons/youtube.svg" alt="Youtube" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
