import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-[#111111] border border-border rounded-lg p-8 shadow-lg text-center">
          <h1 className="mb-4 text-5xl font-bold text-teal-400">SPORE FALL</h1>
          <p className="mb-8 text-xl text-gray-300">Administrative Dashboard Console</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about">
              <Button className="w-full sm:w-auto">About</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
