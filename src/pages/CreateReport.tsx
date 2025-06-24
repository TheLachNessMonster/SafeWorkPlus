import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { nuIncidentService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Incident } from '../types';

interface ReportForm {
  title: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export default function CreateReport() {
  const navigate = useNavigate();
  const { user } = useAuth(); // get current user
  const [form, setForm] = useState<ReportForm>({
    title: '',
    description: '',
    riskLevel: 'Low'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // confirm logged-in user
      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      // get the user's workplace id
      const userWorkplaceId = typeof user.workplaceId === 'string' 
        ? user.workplaceId 
        : (user.workplaceId as any)?._id;

      if (!userWorkplaceId) {
        throw new Error('User workplace not properly configured. Please contact your administrator.');
      }

      // create incident with proper user data
      let input: Incident = {
        _id: '', // mongo db handles the null _id field and will generate its own automatically
        title: form.title,
        description: form.description,
        riskLevel: form.riskLevel,
        reportedBy: user._id,
        workplaceId: userWorkplaceId,
        status: 'Open',
        createdAt: new Date().toISOString()
      };

      const newIncident = await nuIncidentService.create(input);

      console.log('Incident created successfully:', newIncident);
      
      // redirect to dashboard after successful submission
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReportForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout 
      title="Report Incident" 
      showBackButton 
      onBack={() => navigate('/dashboard')}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Incident Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Incident Title"
            required
          />
        </div>

        {/* desc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Provide detailed information about the incident"
            required
          />
        </div>

        {/* risk level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Low', 'Medium', 'High'] as const).map(level => (
              <button
                key={level}
                type="button"
                onClick={() => handleInputChange('riskLevel', level)}
                className={`py-2 px-4 rounded-lg border font-medium transition-colors ${
                  form.riskLevel === level
                    ? level === 'Low' ? 'bg-success-500 text-white border-success-500'
                      : level === 'Medium' ? 'bg-warning-500 text-white border-warning-500'
                      : 'bg-danger-500 text-white border-danger-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* photo upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-4xl text-gray-400 mb-2">📷</div>
            <p className="text-sm text-gray-500">Photo capture</p>
          </div>
        </div>

        {/* submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !form.title || !form.description || !user}
          className="w-full bg-primary-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </Layout>
  );
}