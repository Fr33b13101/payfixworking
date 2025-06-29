import React, { useState } from 'react';
import { User, Smartphone, Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { PhotoUpload } from './PhotoUpload';
import { PHONE_MODELS, URGENCY_LEVELS } from '../constants/phoneModels';
import { supabase } from '../lib/supabase';
import type { RepairRequest, UrgencyLevel } from '../types';

interface RepairFormProps {
  onSubmitSuccess: (data: RepairRequest) => void;
}

export const RepairForm: React.FC<RepairFormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneModel: '',
    issueDescription: '',
    urgency: 'medium' as const
  });
  
  const [voiceRecording, setVoiceRecording] = useState<Blob | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedUrgency = URGENCY_LEVELS.find(level => level.value === formData.urgency);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneModel) {
      newErrors.phoneModel = 'Please select your phone model';
    }

    // Allow submission if either text description OR voice recording is provided
    if (!formData.issueDescription.trim() && !voiceRecording) {
      newErrors.issueDescription = 'Please describe the issue or record a voice message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFile = async (file: Blob | File, folder: string, extension: string) => {
    try {
      console.log(`Starting upload for ${folder}/${extension} file...`);
      
      // Create a unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const fileName = `${timestamp}-${randomId}.${extension}`;
      const filePath = `${folder}/${fileName}`;

      console.log(`Uploading to path: ${filePath}`);
      console.log(`File size: ${file.size} bytes`);
      console.log(`File type: ${file.type || 'unknown'}`);

      // For voice recordings, ensure we have the right MIME type
      let uploadFile = file;
      if (file instanceof Blob && folder === 'voice-recordings') {
        // Create a new blob with explicit MIME type for voice recordings
        uploadFile = new Blob([file], { type: 'audio/webm' });
        console.log('Created voice recording blob with MIME type: audio/webm');
      }

      // Upload the file
      const { data, error } = await supabase.storage
        .from('repair-requests')
        .upload(filePath, uploadFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: uploadFile.type || (folder === 'voice-recordings' ? 'audio/webm' : undefined)
        });

      if (error) {
        console.error('Upload error details:', error);
        
        // Handle specific error cases
        if (error.message.includes('Bucket not found')) {
          throw new Error('Storage not configured. Please contact support.');
        } else if (error.message.includes('size')) {
          throw new Error('File too large. Maximum size is 10MB.');
        } else if (error.message.includes('mime') || error.message.includes('type')) {
          throw new Error('File type not supported.');
        } else if (error.message.includes('duplicate')) {
          // If duplicate, try with a new filename
          const newFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
          const newFilePath = `${folder}/${newFileName}`;
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('repair-requests')
            .upload(newFilePath, uploadFile, {
              cacheControl: '3600',
              upsert: false,
              contentType: uploadFile.type || (folder === 'voice-recordings' ? 'audio/webm' : undefined)
            });
            
          if (retryError) {
            throw new Error(`Upload failed: ${retryError.message}`);
          }
          
          const { data: retryUrlData } = supabase.storage
            .from('repair-requests')
            .getPublicUrl(newFilePath);
            
          console.log('File uploaded successfully (retry):', retryUrlData.publicUrl);
          return retryUrlData.publicUrl;
        } else {
          throw new Error(`Upload failed: ${error.message}`);
        }
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('repair-requests')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
      
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      let voiceRecordingUrl = '';
      let photoUrl = '';

      // Upload voice recording if exists
      if (voiceRecording) {
        console.log('Uploading voice recording...');
        console.log('Voice recording details:', {
          size: voiceRecording.size,
          type: voiceRecording.type
        });
        
        try {
          voiceRecordingUrl = await uploadFile(voiceRecording, 'voice-recordings', 'webm');
          console.log('Voice recording uploaded successfully:', voiceRecordingUrl);
        } catch (error) {
          console.error('Voice upload failed:', error);
          throw new Error(`Failed to upload voice recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Upload photo if exists
      if (selectedPhoto) {
        console.log('Uploading photo...');
        try {
          const fileExtension = selectedPhoto.name.split('.').pop()?.toLowerCase() || 'jpg';
          photoUrl = await uploadFile(selectedPhoto, 'photos', fileExtension);
          console.log('Photo uploaded successfully:', photoUrl);
        } catch (error) {
          console.error('Photo upload failed:', error);
          throw new Error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Prepare request data
      const requestData: Omit<RepairRequest, 'id' | 'created_at'> = {
        full_name: formData.fullName,
        email: formData.email,
        phone_model: formData.phoneModel,
        issue_description: formData.issueDescription || null,
        voice_recording_url: voiceRecordingUrl || null,
        photo_url: photoUrl || null,
        urgency: formData.urgency,
        status: 'pending'
      };

      console.log('Submitting request data:', requestData);

      // Save to database
      const { data, error } = await supabase
        .from('repair_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to save request. Please try again.');
      }

      console.log('Request saved to database:', data);

      // Try to send confirmation email (don't fail if this doesn't work)
      try {
        console.log('Attempting to send confirmation email...');
        
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-confirmation-email', {
          body: {
            email: formData.email,
            name: formData.fullName,
            requestId: data.id,
            phoneModel: formData.phoneModel,
            urgency: formData.urgency,
            turnaround: selectedUrgency?.turnaround
          }
        });
        
        if (emailError) {
          console.warn('Email function error:', emailError);
          // Don't fail the entire submission if email fails
        } else {
          console.log('Confirmation email sent successfully:', emailData);
        }
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
        // Don't fail the entire submission if email fails
      }

      // Show success regardless of email status
      onSubmitSuccess(data);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      
      let errorMessage = 'There was an error submitting your request. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Repair Request</h2>
        <p className="text-gray-600">
          Tell us about your device issue and we'll get it fixed quickly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Smartphone className="w-4 h-4 inline mr-2" />
            Phone Model *
          </label>
          <select
            value={formData.phoneModel}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneModel: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.phoneModel ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select your phone model</option>
            {PHONE_MODELS.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          {errors.phoneModel && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.phoneModel}
            </p>
          )}
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Description *
          </label>
          <textarea
            value={formData.issueDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
              errors.issueDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Describe the problem with your device in detail..."
          />
          {errors.issueDescription && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.issueDescription}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            You can describe the issue in text above OR record a voice message below
          </p>
        </div>

        {/* Voice Recording */}
        <VoiceRecorder
          onRecordingComplete={setVoiceRecording}
          onRecordingDelete={() => setVoiceRecording(null)}
          hasRecording={!!voiceRecording}
        />

        {/* Photo Upload */}
        <PhotoUpload
          onPhotoSelect={setSelectedPhoto}
          onPhotoRemove={() => setSelectedPhoto(null)}
          selectedPhoto={selectedPhoto}
        />

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Urgency Level *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {URGENCY_LEVELS.map((level: UrgencyLevel) => (
              <label
                key={level.value}
                className={`relative cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${
                  formData.urgency === level.value
                    ? `${level.bgColor} border-current`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={level.value}
                  checked={formData.urgency === level.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className={`font-semibold ${level.color} mb-1`}>
                    {level.label}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {level.description}
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {level.turnaround}
                  </div>
                </div>
                {formData.urgency === level.value && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 absolute top-2 right-2" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Estimated Turnaround */}
        {selectedUrgency && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Estimated Turnaround Time
                </p>
                <p className="text-sm text-blue-700">
                  Based on {selectedUrgency.label.toLowerCase()}: {selectedUrgency.turnaround}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Submit Repair Request
            </>
            )}
        </button>
      </form>
    </div>
  );
};