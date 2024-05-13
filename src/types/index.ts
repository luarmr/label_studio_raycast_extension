export interface Preferences {
  appURL: string;
  apiToken: string;
}

export interface Project {
  id: string;
  title: string;
  created_at: string;
  color: string;
  is_published: boolean;
  is_draft: boolean;
  pinned_at?: Date;
}

export interface Workspace {
  id: number;
  title: string;
}

export interface ProjectListItemProps {
  project: Project;
  isDetailLoading: boolean;
  setIsDetailLoading: (isDetailLoading: boolean) => void;
}

export interface ProjectApiResponse {
  results: Project[];
  next: string | null;
}

export interface VersionApiResponse {
  "label-studio-enterprise-backend"?: boolean;
}

export interface User {
  id: number;
  active_organization: number;
  org_membership: OrgMembership[];
}

export interface OrgMembership {
  role: string;
  active: boolean;
  organization_id: number;
}
export interface UserContextType {
  user: User | null;
  isEnterprise: boolean;
  isRestrictedUser: boolean;
}

interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Project {
  title: string;
  description: string;
  color: string;
  maximum_annotations: number;
  is_published: boolean;
  is_draft: boolean;
  created_by: UserDetails;
  created_at: string;
  pinned_at?: Date;
  num_tasks_with_annotations: number;
  task_number: number;
  useful_annotation_number: number;
  ground_truth_number: number;
  skipped_annotations_number: number;
  total_annotations_number: number;
  total_predictions_number: number;
  overlap_cohort_percentage: number;
  finished_task_number: number;
}

export interface ProjectApiResponse {
  results: Project[];
}

export interface ProjectDetailProps {
  projectId: string;
}
