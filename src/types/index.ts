import { ReactElement } from "react";

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

export interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
}

export interface Project {
  title: string;
  description: string;
  color: string;
  is_published: boolean;
  is_draft: boolean;
  created_at: string;
  pinned_at?: Date;
  workspaceName?: string;
  workspace: number;
}

export interface ProjectDetail {
  title: string;
  description: string;
  color: string;
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
  finished_task_number: number;
  workspaceName: string;
  members?: Member[];
  ready: boolean;
}

interface Member {
  user: UserDetails;
}

export interface ProjectApiResponse {
  results: Project[];
  next: string | null;
}

export interface ProjectDetailApiResponse {
  results: ProjectDetail[];
  next: string | null;
}

export interface VersionApiResponse {
  "label-studio-enterprise-backend"?: boolean;
}

export interface ProjectListItemProps {
  project: Project;
}

export interface ProjectDetailProps {
  projectId: string;
  projectActions: ReactElement;
}

export interface ProjectActionsProps {
  project: Project;
  isRestrictedUser: boolean;
  isEnterprise: boolean;
}
