import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { CheckCircle2, Package, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';
import { useNotification } from '../context/NotificationContext';

export const DownloadPage: React.FC = () => {
  const { selectedBooks, clearCart, totalCount } = useCart();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [isPreparing, setIsPreparing] = useState(true);

  useEffect(() => {
    // Simulate package preparation
    const timer = setTimeout(() => {
      setIsPreparing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadCSV = () => {
    try {
      exportToCSV(Array.from(selectedBooks.values()));
      showToast('Metadata CSV downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to export CSV', 'error');
    }
  };

  const handleDownloadZIP = () => {
    showToast('Download started for ZIP package...', 'info');
    // Placeholder for actual ZIP generation
    setTimeout(() => {
      showToast('Downloading books (Simulated ZIP)...', 'success');
    }, 1000);
  };

  const handleFinish = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <StepIndicator currentStep={4} />

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          {/* Animated Background Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100/50 rounded-full blur-3xl -mr-32 -mt-32 -z-10 animate-pulse" />
          
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
              <CheckCircle2 size={48} />
            </div>
            
            <h2 className="text-4xl font-black text-gray-900 mb-4 font-display">Purchase Successful!</h2>
            <p className="text-gray-500 font-medium mb-12 max-w-md mx-auto">
              Your {totalCount} books have been processed and are ready for download below.
            </p>

            {isPreparing ? (
              <div className="py-20 space-y-4">
                <Loader2 className="mx-auto text-primary-500 animate-spin" size={48} />
                <p className="text-sm font-black text-primary-600 uppercase tracking-widest animate-pulse">
                  Preparing your download package...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <button
                  onClick={handleDownloadZIP}
                  className="group bg-primary-600 hover:bg-primary-700 p-8 rounded-[2rem] text-white transition-all transform hover:-translate-y-2 shadow-xl shadow-primary-500/20"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <h3 className="text-lg font-black mb-1">Download All</h3>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Books (ZIP)</p>
                </button>

                <button
                  onClick={handleDownloadCSV}
                  className="group bg-white hover:bg-secondary-50 p-8 rounded-[2rem] text-secondary-700 border-2 border-secondary-100 transition-all transform hover:-translate-y-2 shadow-xl shadow-secondary-500/5"
                >
                  <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-lg font-black mb-1">Download Meta</h3>
                  <p className="text-secondary-400 text-xs font-bold uppercase tracking-widest">Listing (CSV)</p>
                </button>
              </div>
            )}

            <div className="pt-8 border-t border-gray-100">
              <button
                onClick={handleFinish}
                className="flex items-center justify-center gap-2 mx-auto text-gray-400 hover:text-primary-600 font-black text-sm uppercase tracking-widest transition-all group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Finish & Go to Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
