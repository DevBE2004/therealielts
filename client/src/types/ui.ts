// ========================================
// COMMON TYPES
// ========================================

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  isVisible: boolean;
}

export interface Breadcrumb {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
  isActive?: boolean;
  isExpanded?: boolean;
}
