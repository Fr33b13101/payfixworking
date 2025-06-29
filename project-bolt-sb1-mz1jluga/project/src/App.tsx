import React, { useState } from 'react';
import { Wrench, Shield, Clock, Star, Smartphone } from 'lucide-react';
import { RepairForm } from './components/RepairForm';
import { SuccessMessage } from './components/SuccessMessage';
import type { RepairRequest } from './types';

function App() {
  const [submittedRequest, setSubmittedRequest] = useState<RepairRequest | null>(null);

  const handleSubmitSuccess = (request: RepairRequest) => {
    setSubmittedRequest(request);
  };

  const handleNewRequest = () => {
    setSubmittedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PayFix</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Fast Turnaround</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure Service</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4" />
                <span>Expert Technicians</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        {!submittedRequest ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-8 shadow-xl">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Professional Mobile
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent block">
                  Repair Service
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Get your device fixed by certified technicians. Submit your repair request with detailed descriptions, voice recordings, or photos for accurate diagnosis and fast service.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Service</h3>
                  <p className="text-gray-600">Quick turnaround times based on urgency level, from 24 hours to 7 days.</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Process</h3>
                  <p className="text-gray-600">Your data and device are handled with the highest security standards.</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Care</h3>
                  <p className="text-gray-600">Certified technicians with years of experience in mobile device repair.</p>
                </div>
              </div>
            </div>

            {/* Repair Form */}
            <RepairForm onSubmitSuccess={handleSubmitSuccess} />
          </>
        ) : (
          <SuccessMessage request={submittedRequest} onNewRequest={handleNewRequest} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">PayFix</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional mobile device repair service with fast turnaround times and expert technicians.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Screen Repair</li>
                <li>Battery Replacement</li>
                <li>Water Damage</li>
                <li>Software Issues</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Track Repair</li>
                <li>FAQ</li>
                <li>
                  <a 
                    href="https://wa.me/2348052689119" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </li>
                <li>Warranty</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PayFix. All rights reserved. Professional mobile repair services.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;