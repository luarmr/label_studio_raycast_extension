import { Action, ActionPanel, Color, Icon, List, open, showToast, Toast } from "@raycast/api";
import { ProjectListItemProps } from "../types";
import { useAPIAccess } from "../context/APIAccessContext";
import { useUser } from "../context/UserContext";
import ProjectDetail from "./projectDetail";

export default function ProjectListItem({ project, isDetailLoading, setIsDetailLoading }: ProjectListItemProps) {
  const { appURL } = useAPIAccess();
  const { isEnterprise, isRestrictedUser } = useUser();
  const accessories: List.Item.Accessory[] = [];
  const urlProjectBase = `${appURL}/projects/${project.id}`;

  if (!project.is_published) accessories.push({ tag: { value: "Unpublished", color: Color.Blue } });
  if (project.is_draft) accessories.push({ tag: { value: "Draft", color: Color.Red } });
  // accessories.push({ icon: { source: "rectangle.svg", tintColor: project.color } });

  const handleOpenDataPage = () => {
    if (!project.is_published && isRestrictedUser) {
      showToast(Toast.Style.Failure, "This project needs to be published for you to access.");
      return;
    }

    const url = isRestrictedUser ? urlProjectBase : `${urlProjectBase}/data`;
    open(url);
  };

  const toggleDetailView = () => {
    setIsDetailLoading(!isDetailLoading);
  };

  return (
    <List.Item
      key={project.id}
      icon={{ source: project.pinned_at ? "project-pinned.svg" : "project.svg", tintColor: project.color }}
      title={project.title}
      subtitle={project.workspaceName}
      accessories={accessories}
      detail={isDetailLoading ? <ProjectDetail projectId={project.id} /> : undefined}
      actions={
        <ActionPanel>
          <Action title="Open Data Page" icon={"data-manager.svg"} onAction={handleOpenDataPage} />
          <Action title="Toggle View Details" icon={Icon.Info} onAction={toggleDetailView} />
          {isEnterprise && !isRestrictedUser && (
            <>
              <Action.OpenInBrowser
                title="Open Project Dashboard"
                icon={"dashboard.svg"}
                url={`${appURL}/projects/${project.id}/dashboard`}
              />
              <Action.OpenInBrowser
                title="Open Project Members"
                icon={"members.svg"}
                url={`${appURL}/projects/${project.id}/members`}
              />
            </>
          )}
          {!isRestrictedUser && (
            <Action.OpenInBrowser
              title="Open Project Settings"
              icon={"settings.svg"}
              url={`${urlProjectBase}/settings`}
            />
          )}
          <Action.CopyToClipboard
            title="Copy Project JSON"
            icon={Icon.Clipboard}
            content={JSON.stringify(project, null, 2)}
          />
        </ActionPanel>
      }
    />
  );
}
