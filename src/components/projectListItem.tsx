import { Action, ActionPanel, Color, Icon, List, open, showToast, Toast } from "@raycast/api";
import { formatDistanceToNow, parseISO } from "date-fns";
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
  accessories.push({ icon: { source: "rectangle.svg", tintColor: project.color } });

  const handleOpenDataPage = () => {
    if (project.is_published || !isEnterprise || !isRestrictedUser) {
      open(urlProjectBase);
    } else {
      showToast(Toast.Style.Failure, "This project needs to be published for you to access.");
    }
  };

  return (
    <List.Item
      key={project.id}
      icon={project.pinned_at ? { source: "thumbtack.svg", tintColor: Color.PrimaryText } : undefined}
      title={project.title}
      subtitle={`Created ${formatDistanceToNow(parseISO(project.created_at))} ago`}
      accessories={accessories}
      detail={isDetailLoading && <ProjectDetail projectId={project.id} />}
      actions={
        <ActionPanel>
          <Action title="Open Data Page" icon={Icon.AppWindow} onAction={handleOpenDataPage} />
          <Action
            title="Togle View Details"
            icon={Icon.Info}
            onAction={() => {
              setIsDetailLoading(!isDetailLoading);
            }}
          />

          {isEnterprise && !isRestrictedUser && (
            <>
              <Action.OpenInBrowser
                title="Open Project Dashboard"
                icon={Icon.Gauge}
                url={`${appURL}/projects/${project.id}/dashboard`}
              />
              <Action.OpenInBrowser
                title="Open Project Members"
                icon={Icon.Person}
                url={`${appURL}/projects/${project.id}/members`}
              />
            </>
          )}
          {!isRestrictedUser && (
            <Action.OpenInBrowser title="Open Project Settings" icon={Icon.Gear} url={`${urlProjectBase}/settings`} />
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
