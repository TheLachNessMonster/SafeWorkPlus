import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import type { Incident } from '../types';
//import { incidentService } from '../services/api.ts';
import { nuIncidentService } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({
    open: 0,
    resolved: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // can the real api call please stand up...
        const data = await nuIncidentService.getAll();
        
        setIncidents(data);
        
        // calc stats from real data
        const openCount = data.filter(i => 
          i.status === 'Open' || i.status === 'In Progress'
        ).length;
        const resolvedCount = data.filter(i => 
          i.status === 'Resolved' || i.status === 'Closed'
        ).length;
        
        setStats({
          open: openCount,
          resolved: resolvedCount,
          total: data.length
        });
        
      } catch (err) {
        console.error('error fetching incidents:', err);
        setError('Failed to load incidents. Please try again.');
      } finally {
        setLoading(false);
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

  // loading state
  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading Dashboard...</div>
          </div>
        </div>
      </Layout>
    );
  }

  // error state
  if (error) {
    return (
      <Layout title="Dashboard">
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
    <Layout title="Dashboard">
      {/* stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-warning-500">{stats.open}</div>
          <div className="text-xs text-gray-600">active</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-success-500">{stats.resolved}</div>
          <div className="text-xs text-gray-600">resolved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
          <div className="text-xs text-gray-600">total</div>
        </div>
      </div>

      {/* recent incidents */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Recent Incidents</h2>
          <button 
            onClick={() => navigate('/incidents')}
            className="text-primary-500 hover:text-blue-600 transition-colors flex items-center"
          >
            <span className="text-sm mr-1">View All</span>
            <span className="text-lg">→</span>
          </button>
        </div>

        {/* empty state */}
        {incidents.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 text-4xl mb-2">📋</div>
            <div className="text-gray-500 text-lg mb-1">No incidents yet</div>
            <div className="text-gray-400 text-sm mb-4">Workplace looking safe!</div>
            <button
              onClick={() => navigate('/create-report')}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Report Incident
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* show only recent incidents (last 5 -- adjust as needed) */}
            {incidents
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map(incident => (
                <div 
                  key={incident._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/incidents/${incident._id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{incident.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(incident.riskLevel)}`}>
                      {incident.riskLevel}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {incident.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
                    <span>{getTimeAgo(incident.createdAt)}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </Layout>
  );
}