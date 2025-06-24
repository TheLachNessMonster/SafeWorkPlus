/**
 * @fileoverview Role-Based UI Component Guard - PROTOTYPE IMPLEMENTATION
 * 
 * IMPORTAMT: This component provides UI-level access control only.
 * It does NOT provide security - users can still access restricted data via
 * browser dev tools, API calls, or by modifying client-side code.
 * 
 * This is a prototype for demonstrating role-based UI patterns.
 * 
 * For production security:
 * - Move all authorisation logic to the backend
 * - Use server-side route protection and data filtering
 * - Treat this component as a UX enhancement, not a security measure
 * 
 * @example
 * // Shows delete button only to foremen, hides it from regular users
 * <RoleGuard requiredRole="foreman">
 *   <DeleteButton />
 * </RoleGuard>
 * 
 * @author Ashley (Frontend)
 * @version 0.1.0 - Prototype
 */

import { type ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: 'user' | 'foreman';
  requiredPermission?: keyof ReturnType<typeof usePermissions>;
  fallback?: ReactNode;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission,
  fallback = null 
}: RoleGuardProps) {
  const permissions = usePermissions();

  // check role-based access
  if (requiredRole) {
    if (requiredRole === 'foreman' && !permissions.isForeman) {
      return <>{fallback}</>;
    }
    if (requiredRole === 'user' && !permissions.isUser && !permissions.isForeman) {
      return <>{fallback}</>;
    }
  }

  // check permission-based access
  if (requiredPermission && !permissions[requiredPermission]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
