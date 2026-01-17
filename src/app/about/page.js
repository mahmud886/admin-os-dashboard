export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-[#111111] border border-border rounded-lg p-8 shadow-lg">
          <h1 className="mb-6 text-4xl font-bold text-center text-teal-400">About SPORE FALL</h1>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg leading-relaxed">
              SPORE FALL is an administrative dashboard and console designed for system management and monitoring.
            </p>
            <p className="leading-relaxed">
              This platform provides secure access to administrative functions and system analytics through a modern,
              intuitive interface.
            </p>
            <div className="pt-6 mt-6 border-t border-border">
              <h2 className="mb-3 text-xl font-semibold text-teal-400">System Information</h2>
              <ul className="space-y-2 text-gray-400">
                <li>• Secure authentication system</li>
                <li>• Real-time dashboard analytics</li>
                <li>• Protected administrative routes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
