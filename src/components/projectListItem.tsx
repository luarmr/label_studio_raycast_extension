import React from "react";
import { List, Color, Action, ActionPanel } from "@raycast/api";
import { ProjectListItemProps } from "../types";
import ProjectActions from "./projectActions";
import ProjectDetail from "./projectDetail";
import { useUser } from "../context/UserContext";

export default function ProjectListItem({ project }: ProjectListItemProps) {
  const { isEnterprise, isRestrictedUser } = useUser();
  const accessories: List.Item.Accessory[] = [];

  if (!project.is_published) accessories.push({ tag: { value: "Unpublished", color: Color.Blue } });
  if (project.is_draft) accessories.push({ tag: { value: "Draft", color: Color.Red } });

  const projectActions = (
    <ProjectActions project={project} isRestrictedUser={isRestrictedUser} isEnterprise={isEnterprise} />
  );

  const color = project.color === "#FFFFFF" ? Color.SecondaryText : project.color;

  return (
    <List.Item
      key={project.id}
      icon={{ source: project.pinned_at ? "project-pinned.svg" : "project.svg", tintColor: color }}
      title={project.title}
      subtitle={project.workspaceName}
      accessories={accessories}
      actions={
        <ActionPanel>
          <Action.Push
            title="Details Panel"
            icon={"side-panel.svg"}
            target={<ProjectDetail projectId={project.id} projectActions={projectActions} />}
          />
          {projectActions}
        </ActionPanel>
      }
    />
  );
}
