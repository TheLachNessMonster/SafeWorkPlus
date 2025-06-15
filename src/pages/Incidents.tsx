import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import type { Incident } from '../types';

export default function AllIncidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const mockIncidents: Incident[] = [
          {
            _id: '1',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user123',
            workplaceId: 'workplace123',
            status: 'Open',
            riskLevel: 'High',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user456',
            workplaceId: 'workplace123',
            status: 'In Progress',
            riskLevel: 'Medium',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user789',
            workplaceId: 'workplace123',
            status: 'Resolved',
            riskLevel: 'Low',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '4',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user234',
            workplaceId: 'workplace123',
            status: 'Open',
            riskLevel: 'High',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user567',
            workplaceId: 'workplace123',
            status: 'Resolved',
            riskLevel: 'Medium',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '6',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user890',
            workplaceId: 'workplace123',
            status: 'In Progress',
            riskLevel: 'High',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '7',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user345',
            workplaceId: 'workplace123',
            status: 'Open',
            riskLevel: 'Low',
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '8',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user678',
            workplaceId: 'workplace123',
            status: 'Resolved',
            riskLevel: 'Medium',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '9',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user123',
            workplaceId: 'workplace123',
            status: 'Open',
            riskLevel: 'Medium',
            createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '10',
            title: 'Title',
            description: 'Desc.',
            reportedBy: 'user456',
            workplaceId: 'workplace123',
            status: 'In Progress',
            riskLevel: 'High',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];

        // mock API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIncidents(mockIncidents);
      } catch (err) {
        console.error('error fetching incidents:', err);
        setError('failed to load incidents. try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const getRiskLevelColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'High': return 'bg-danger-500 text-white';
      case 'Medium': return 'bg-warning-500 text-white';
      case 'Low': return 'bg-success-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'In Progress': return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'Resolved': return 'bg-gray-50 text-gray-600 border border-gray-200';
      case 'Closed': return 'bg-gray-50 text-gray-500 border border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <Layout title="All Incidents" showBackButton onBack={() => navigate('/dashboard')}>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading incidents...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="All Incidents" showBackButton onBack={() => navigate('/dashboard')}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="All Incidents" showBackButton onBack={() => navigate('/dashboard')}>
      {/* simple header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Incidents</h2>
        <p className="text-sm text-gray-600 mt-1">
          {incidents.length} incident{incidents.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* incidents list */}
      <div className="space-y-3 pb-20">
        {incidents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">no incidents found</div>
          </div>
        ) : (
          incidents.map(incident => (
            <div 
              key={incident._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/incidents/${incident._id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 flex-1 pr-2">{incident.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(incident.riskLevel)}`}>
                  {incident.riskLevel}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {incident.description}
              </p>
              
              <div className="flex justify-between items-center text-xs">
                <span className={`px-2 py-1 rounded ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
                <span className="text-gray-500">{getTimeAgo(incident.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </Layout>
  );
}