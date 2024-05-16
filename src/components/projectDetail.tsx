import { List, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAPIAccess } from "../context/APIAccessContext";
import { ProjectDetailApiResponse, ProjectDetailProps } from "../types";

const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const { apiToken, appURL } = useAPIAccess();
  const { data, isLoading, error } = useFetch<ProjectDetailApiResponse>(
    `${appURL}/api/projects?ids=${projectId}&include=id%2Ctitle%2Cdescription%2Ccolor%2Cmaximum_annotations%2Cis_published%2Cis_draft%2Ccreated_by%2Ccreated_at%2Cpinned_at%2Cnum_tasks_with_annotations%2Ctask_number%2Cuseful_annotation_number%2Cground_truth_number%2Cskipped_annotations_number%2Ctotal_annotations_number%2Ctotal_predictions_number%2Coverlap_cohort_percentage%2Cfinished_task_number`,
    {
      headers: { Authorization: `Token ${apiToken}` },
    },
  );

  useEffect(() => {
    if (error) {
      showToast(Toast.Style.Failure, "Failed to load project details", error.message);
    }
  }, [error]);

  if (isLoading) {
    return <List.Item.Detail isLoading={true} />;
  }

  const project = data?.results[0];

  if (!project) {
    return <List.Item.Detail markdown="No project details available." />;
  }

  return (
    <List.Item.Detail
      markdown={`## ${project.title}\n${project.description || "No description available."}`}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label
            title="Created By"
            text={
              project.created_by.first_name || project.created_by.last_name
                ? `${project.created_by.first_name} ${project.created_by.last_name}`
                : "No Name"
            }
          />
          <List.Item.Detail.Metadata.Label title="Published" text={project.is_published ? "Yes" : "No"} />
          <List.Item.Detail.Metadata.Label
            title="Created At"
            text={`${formatDistanceToNow(parseISO(project.created_at))} ago`}
          />
          <List.Item.Detail.Metadata.Label title="Pinned" text={project.pinned_at ? "Yes" : "No"} />
          <List.Item.Detail.Metadata.Label title="Draft" text={project.is_draft ? "Yes" : "No"} />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="Total Tasks" text={`${project.task_number}`} />
          <List.Item.Detail.Metadata.Label
            title="Tasks with Annotations"
            text={`${project.num_tasks_with_annotations}`}
          />
          <List.Item.Detail.Metadata.Label title="Finished Task Number" text={`${project.finished_task_number}`} />
          <List.Item.Detail.Metadata.Label title="Total Annotations" text={`${project.total_annotations_number}`} />
          <List.Item.Detail.Metadata.Label title="Skipped Annotations" text={`${project.skipped_annotations_number}`} />
          <List.Item.Detail.Metadata.Label title="Maximum Annotations" text={`${project.maximum_annotations}`} />
          <List.Item.Detail.Metadata.Label
            title="Useful Annotation Number"
            text={`${project.useful_annotation_number}`}
          />
          <List.Item.Detail.Metadata.Label title="Ground Truth Number" text={`${project.ground_truth_number}`} />
          <List.Item.Detail.Metadata.Label title="Total Predictions" text={`${project.total_predictions_number}`} />
          <List.Item.Detail.Metadata.Label title="Overlap Cohort %" text={`${project.overlap_cohort_percentage}%`} />
        </List.Item.Detail.Metadata>
      }
    />
  );
};

export default ProjectDetail;
