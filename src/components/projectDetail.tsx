import { List, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAPIAccess } from "../context/APIAccessContext";
import { ProjectApiResponse, ProjectDetailProps } from "../types";

const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const { apiToken, appURL } = useAPIAccess();
  const { data, isLoading, error } = useFetch<ProjectApiResponse>(
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

  const colorBox = `<img src="https://via.placeholder.com/200x5/${project.color.replace("#", "")}/000000?text=+" alt="color" />`;
  const name =
    project.created_by.first_name || project.created_by.last_name
      ? `${project.created_by.first_name} ${project.created_by.last_name}`
      : `No Name`;
  const detailContent = `
## ${project.title}
${project.description}


| Field                        | Details                                   |
|------------------------------|-------------------------------------------|
| **Created By**               | ${name} |
| **Published**                | ${project.is_published ? "Yes" : "No"} |
| **Created At**               | ${formatDistanceToNow(parseISO(project.created_at))} ago |
| **Pinned**                   | ${project.pinned_at ? "Yes" : "No"} |
| **Draft**                    | ${project.is_draft ? "Yes" : "No"} |
| **Total Tasks**              | ${project.task_number}             |
| **Tasks with Annotations**   | ${project.num_tasks_with_annotations} |
| **Finished Task Number**     | ${project.finished_task_number}    |
| **Total Annotations**        | ${project.total_annotations_number} |
| **Skipped Annotations**      | ${project.skipped_annotations_number} |
| **Maximum Annotations**      | ${project.maximum_annotations}     |
| **Useful Annotation Number** | ${project.useful_annotation_number} |
| **Ground Truth Number**      | ${project.ground_truth_number}     |
| **Total Predictions**        | ${project.total_predictions_number} |
| **Overlap Cohort %**         | ${project.overlap_cohort_percentage}% |

${colorBox}
`;

  return <List.Item.Detail markdown={detailContent} />;
};

export default ProjectDetail;
