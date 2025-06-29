import React from 'react';
import { CheckCircle2, Clock, Mail, Smartphone, RotateCcw } from 'lucide-react';
import { PHONE_MODELS, URGENCY_LEVELS } from '../constants/phoneModels';
import type { RepairRequest } from '../types';

interface SuccessMessageProps {
  request: RepairRequest;
  onNewRequest: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ request, onNewRequest }) => {
  const phoneModel = PHONE_MODELS.find(model => model.value === request.phone_model);
  const urgencyLevel = URGENCY_LEVELS.find(level => level.value === request.urgency);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Request Submitted Successfully!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Thank you, {request.full_name}! We've received your repair request and will get back to you soon.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Device</p>
                <p className="font-medium">{phoneModel?.label || request.phone_model}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{request.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <p className={`font-medium ${urgencyLevel?.color}`}>
                  {urgencyLevel?.label}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <RotateCcw className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Expected Turnaround</p>
                <p className="font-medium">{urgencyLevel?.turnaround}</p>
              </div>
            </div>
          </div>

          {request.issue_description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Issue Description</p>
              <p className="text-gray-700">{request.issue_description}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Confirmation Email Sent
                </p>
                <p className="text-sm text-blue-700">
                  Check your inbox for a detailed confirmation with your request ID and next steps.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-green-900 mb-1">
                  What happens next?
                </p>
                <p className="text-sm text-green-700">
                  Our technical team will review your request and contact you within 2 hours to discuss the repair process and provide a quote.
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNewRequest}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );
};