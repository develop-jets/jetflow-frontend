export default function CheckEmailPage() {
  return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📩 Check your email</h1>
          <p className="text-gray-600 max-w-md">
            We've sent a verification link to your email address. <br />
            Please click the link in your inbox to verify your account.
          </p>
        </div>
  );
}