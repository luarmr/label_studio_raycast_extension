import React, { useEffect, useState } from "react";
import { ActionPanel, Color, Detail, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import getAPIAccess from "../utils/apiAccess";
import { ProjectDetailApiResponse, ProjectDetailProps } from "../types";
import { createInitialsIcon, createColorIcon, formatDate, fetchAvatarUrl } from "../utils/avatar";

const ProjectDetail = ({ projectId, projectActions }: ProjectDetailProps) => {
  const { apiToken, appURL } = getAPIAccess();
  const params = new URLSearchParams({
    ids: String(projectId),
    include: [
      "id",
      "title",
      "description",
      "color",
      "is_published",
      "is_draft",
      "created_by",
      "created_at",
      "pinned_at",
      "num_tasks_with_annotations",
      "task_number",
      "ground_truth_number",
      "skipped_annotations_number",
      "total_annotations_number",
      "total_predictions_number",
      "finished_task_number",
      "workspace",
      "members",
      "ready",
    ].join(","),
  });

  const url = `${appURL}/api/projects?${params.toString()}`;

  const { data, isLoading, error } = useFetch<ProjectDetailApiResponse>(url, {
    headers: { Authorization: `Token ${apiToken}` },
  });

  const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (error) {
      showToast(Toast.Style.Failure, "Failed to load project details", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data?.results) {
      const fetchAvatars = async () => {
        const urls: Record<string, string> = {};
        const project = data.results[0];

        if (project.created_by.avatar) {
          urls[project.created_by.id] = await fetchAvatarUrl(project.created_by.avatar, apiToken);
        }

        for (const member of project.members) {
          if (member.user.avatar) {
            urls[member.user.id] = await fetchAvatarUrl(member.user.avatar, apiToken);
          }
        }

        setAvatarUrls(urls);
      };
      fetchAvatars();
    }
  }, [data, apiToken]);

  if (isLoading) {
    return <Detail isLoading={true} />;
  }

  const project = data?.results[0];

  if (!project) {
    return <Detail markdown="No project details available." />;
  }

  const createdByIcon = avatarUrls[project.created_by.id] || createInitialsIcon(project.created_by);

  const createdByText =
    project.created_by.first_name || project.created_by.last_name
      ? `${project.created_by.first_name} ${project.created_by.last_name}`
      : project.created_by.email;

  const markdown = `
## ${project.title}

#
---
#


Tasks: ${project.task_number}, Skipped: ${project.skipped_annotations_number}, Finished: ${project.finished_task_number}

Ground Truth: ${project.ground_truth_number}, Predictions: ${project.total_predictions_number}, Annotations: ${project.total_annotations_number}

#
---
#


${project.description || "No description available."}

  `;

  return (
    <Detail
      navigationTitle={project.title}
      markdown={markdown}
      isLoading={isLoading}
      actions={<ActionPanel>{projectActions}</ActionPanel>}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Status">
            <Detail.Metadata.TagList.Item
              text={project.is_published ? "Published" : "Not Published"}
              color={project.is_published ? Color.Green : Color.Red}
            />
            <Detail.Metadata.TagList.Item
              text={project.ready ? "Ready" : "Not Ready"}
              color={project.ready ? Color.Green : Color.Red}
            />
            {project.is_draft && <Detail.Metadata.TagList.Item text="Draft" color={Color.Orange} />}
            <Detail.Metadata.TagList.Item
              text={project.pinned_at ? "Pinned" : "Not Pinned"}
              color={Color.PrimaryText}
              icon={project.pinned_at ? "project-pinned.svg" : "project.svg"}
            />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Created By" text={createdByText} icon={createdByIcon} />
          <Detail.Metadata.Label title="Created At" text={formatDate(project.created_at)} />
          <Detail.Metadata.Separator />
          {project.members.map((member, index) => {
            const memberIcon = avatarUrls[member.user.id] || createInitialsIcon(member.user);
            return (
              <Detail.Metadata.Label
                key={index}
                title={`Member ${index + 1}`}
                text={
                  member.user.first_name || member.user.last_name
                    ? `${member.user.first_name} ${member.user.last_name}`
                    : member.user.email
                }
                icon={memberIcon}
              />
            );
          })}
          {project.members?.length ? <Detail.Metadata.Separator /> : null}
          <Detail.Metadata.Label title="Project Color" text={project.color} icon={createColorIcon(project.color)} />
        </Detail.Metadata>
      }
    />
  );
};

export default ProjectDetail;
