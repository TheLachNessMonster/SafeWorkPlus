import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
//import { incidentService } from '../services/api';
import { nuIncidentService } from '../services/api';
import type { Incident } from '../types';

interface ReportForm {
  title: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export default function CreateReport() {
  const navigate = useNavigate();
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
      // can the real API call please stand up....

      //Here I have added the use of the generic 


      //Suggestion - handle the binding HERE - (manual model binding at view?)
      let input:Incident = {
        //Mongo DB handles the null _id field and will generate its own automatically
        //For the future, good MVC principles would suggest we use a DTO to 
          _id:'',
          title: form.title,
          description: form.description,
          riskLevel: form.riskLevel,
          reportedBy: '684e5ced8fe1c860d4b53d1a', // real Ashley User ID
          workplaceId: '684e5bfc8fe1c860d4b53d0f', // real Construction Site A ID
          status: 'Open',
          createdAt: new Date().toISOString()
        }
      

      const newIncident = await nuIncidentService.create(input)


      console.log('Incident created successfully:', newIncident);
      
      // redirect to dashboard after successful submission
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReportForm, value: string) => { //
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
          disabled={isSubmitting || !form.title || !form.description}
          className="w-full bg-primary-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </Layout>
  );
}