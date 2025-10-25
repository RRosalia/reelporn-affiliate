'use client';

import { useRouter } from 'next/navigation';

interface RegistrationSuccessModalProps {
  username: string;
  onClose: () => void;
}

export default function RegistrationSuccessModal({ username, onClose }: RegistrationSuccessModalProps) {
  const router = useRouter();

  const handleGetStarted = () => {
    onClose();
    router.push('/');
  };

  const partnerLink = `https://reelporn.ai/ref=${username}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Logo/Brand */}
        <h1 className="text-pink-500 text-2xl font-semibold mb-6">
          reelporn.ai
        </h1>

        {/* Welcome Message */}
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">
          Welcome to
        </h2>
        <h3 className="text-2xl font-bold text-zinc-900 mb-6">
          🎉 reelporn.ai's Affiliate Program 🚀
        </h3>

        {/* Description */}
        <p className="text-zinc-600 mb-2">
          You're all set up and ready to go! Start sharing your partner link
        </p>
        <p className="text-pink-500 font-semibold mb-2 break-all">
          {partnerLink}
        </p>
        <p className="text-zinc-600 mb-8">
          to promote ReelPorn and earn commissions.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleGetStarted}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Let's get started!
        </button>
      </div>
    </div>
  );
}
