/**
 * @fileoverview Frontend Role-Based Access Control - PROTOTYPE IMPLEMENTATION
 * 
 * IMPORTANT: this is a frontend-only prototype for UI demonstration purposes.
 * 
 * In a production application, role-based access control should be implemented
 * on the backend with proper JWT claims + server-side authorisation middleware.
 * 
 * Current limitations:
 * - Permissions are calculated client-side (can be bypassed)
 * - Role checking happens after data is already fetched
 * - No server-side enforcement of access rules
 * 
 * Production implementation should include:
 * - JWT tokens with role claims
 * - Backend middleware for route protection
 * - API endpoints that return pre-filtered, role-appropriate data
 * - Server-side validation of all permission checks
 * 
 * @author Ashley (Frontend) 
 * @version 0.1.0 - Prototype
 */

import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();

  const permissions = {
    // basic permissions
    canViewDashboard: !!user,
    canCreateIncident: !!user,
    canViewOwnIncidents: !!user,
    canViewProfile: !!user,
    
    // foreman-specific permissions
    canViewAllIncidents: user?.role === 'foreman',
    canUpdateIncidentStatus: user?.role === 'foreman',
    canDeleteIncidents: user?.role === 'foreman',
    canManageWorkplaces: user?.role === 'foreman',
    canViewUserProfiles: user?.role === 'foreman',
    
    // admin-level permissions (for future)
    canCreateUsers: false, // implement later
    canManageSystem: false, // implement later
  };

  return {
    ...permissions,
    isForeman: user?.role === 'foreman',
    isUser: user?.role === 'user',
    currentUser: user,
  };
}
