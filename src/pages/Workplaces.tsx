import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { nuWorkplaceService } from '../services/api';
import type { Workplace } from '../types';

export default function Workplaces() {
  const navigate = useNavigate();
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const workplacesData = await nuWorkplaceService.getAll();
        setWorkplaces(workplacesData);
      } catch (err) {
        console.error('error fetching workplaces:', err);
        setError('failed to load workplaces. please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkplaces();
  }, []);

  // loading state
  if (loading) {
    return (
      <Layout title="Workplaces" showBackButton onBack={() => navigate('/dashboard')}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading workplaces...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // error state
  if (error) {
    return (
      <Layout title="Workplaces" showBackButton onBack={() => navigate('/dashboard')}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            try again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Workplaces" showBackButton onBack={() => navigate('/dashboard')}>
      {/* header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Workplaces</h2>
        <p className="text-sm text-gray-600 mt-1">
          {workplaces.length} workplace{workplaces.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* workplaces list */}
      <div className="space-y-3 pb-20">
        {workplaces.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 text-4xl mb-2">📍</div>
            <div className="text-gray-500 text-lg mb-1">No workplaces found</div>
            <div className="text-gray-400 text-sm">contact your administrator to add workplaces</div>
          </div>
        ) : (
          workplaces.map(workplace => (
            <div 
              key={workplace._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => { alert("meow")}}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-3">📍</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{workplace.name}</h3>
                      <p className="text-sm text-gray-600">{workplace.location}</p>
                    </div>
                  </div>
                  
                  {/* action indicator - WIP: stats */}
                  <div className="flex items-center gap-3 text-xs mt-3">
                    <span className="bg-primary-500 bg-opacity-20 text-blue-700 px-2 py-1 rounded border border-blue-200">
                      Tap to View Incidents
                    </span>
                  </div>
                </div>

                <div className="text-gray-400">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}