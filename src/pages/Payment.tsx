import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { CreditCard, ShieldCheck, Info } from 'lucide-react';

export const Payment: React.FC = () => {
  const { totalCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <StepIndicator currentStep={3} />

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="bg-primary-600 p-8 text-white relative">
            <CreditCard className="absolute right-8 bottom-8 text-white/10" size={120} />
            <h2 className="text-3xl font-black mb-2">Payment</h2>
            <p className="opacity-80 font-medium">Finalize your purchase of {totalCount} books</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100 flex gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Secure Checkout</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your transaction is protected. We will soon integrate Stripe and PayPal for seamless payments.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Items</span>
                <span className="font-black text-gray-900">{totalCount} Stories</span>
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Processing Fee</span>
                <span className="font-black text-gray-900">$0.00</span>
              </div>
              <div className="h-px bg-gray-100 mx-4" />
              <div className="flex justify-between items-center px-4 py-2">
                <span className="text-gray-900 font-black uppercase tracking-widest text-sm">Total Price</span>
                <span className="text-3xl font-black text-primary-600">$0.00</span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 text-amber-700">
              <Info size={20} className="shrink-0" />
              <p className="text-xs font-semibold leading-relaxed">
                Note: This is a placeholder screen. Clicking "Payment Done" will simulate a successful transaction and take you to the download page.
              </p>
            </div>

            <button
              onClick={() => navigate('/download')}
              className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-gray-900/10 hover:shadow-gray-900/30 hover:scale-[1.02] active:scale-98 transition-all duration-300"
            >
              Payment Done
            </button>
            
            <button
              onClick={() => navigate('/review-selection')}
              className="w-full text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors py-2"
            >
              ← Back to Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
