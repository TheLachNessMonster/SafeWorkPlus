import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // helper function to handle workplace display
  /* 
  this is needed bc user.workplaceId returns a populated object,
  not just a string ID from the BE
  */
  const getWorkplaceDisplay = () => {
    if (!user?.workplaceId) {
      return 'No workplace assigned';
    }
    
    // handle both populated object and string ID
    if (typeof user.workplaceId === 'string') {
      return `Workplace ID: ${user.workplaceId}`;
    }
    
    // if it's a populated object
    if (typeof user.workplaceId === 'object' && user.workplaceId !== null) {
      const workplace = user.workplaceId as any;
      if (workplace.name && workplace.location) {
        return `${workplace.name} - ${workplace.location}`;
      } else if (workplace.name) {
        return workplace.name;
      } else if (workplace._id) {
        return `Workplace ID: ${workplace._id}`;
      }
    }
    
    return 'Unknown workplace';
  };

  if (!user) {
    return (
      <Layout title="Profile">
        <div className="text-center py-12">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      <div className="space-y-6">
        {/* user info card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  user.role === 'foreman' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Workplace</label>
              <p className="mt-1 text-sm text-gray-900">
                {getWorkplaceDisplay()}
              </p>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="space-y-3">
          <button className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colours">
            Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-600 transition-colours"
          >
            Sign Out
          </button>
        </div>
      </div>
    </Layout>
  );
}