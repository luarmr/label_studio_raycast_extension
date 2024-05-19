import { List, showToast, Toast } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState, useEffect } from "react";
import { ProjectApiResponse, Workspace, Project } from "../types";
import getAPIAccess from "../utils/apiAccess";
import ProjectListItem from "./projectListItem";

export default function ProjectList() {
  const { apiToken, appURL } = getAPIAccess();
  const [searchText, setSearchText] = useState<string>("");
  const [workspace, setWorkspace] = useState<string>("");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([{ id: 0, title: "All Projects" }]);

  const { data: workspaceData } = useFetch<Workspace[]>(`${appURL}/api/workspaces?page_size=-1`, {
    headers: { Authorization: `Token ${apiToken}` },
    parseResponse: async (response: Response) => {
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (workspaceData) {
      setWorkspaces([{ id: 0, title: "All Projects" }, ...workspaceData]);
    }
  }, [workspaceData]);

  const { isLoading, data, pagination, error } = useFetch(
    (options) => {
      const page = options.page + 1;
      const pageSize = 25;
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        include: "id,title,created_at,color,is_draft,is_published,pinned_at,workspace",
        title: searchText,
      });

      if (workspace && workspace !== "0") {
        params.append("workspaces", workspace);
      }
      return `${appURL}/api/projects?${params.toString()}`;
    },
    {
      headers: { Authorization: `Token ${apiToken}` },
      parseResponse: async (response: Response) => {
        if (!response.ok) {
          return {
            results: [],
            next: null,
          };
        }
        return response.json();
      },
      initialData: {
        data: [],
        hasMore: false,
        pageSize: 50,
      },
      keepPreviousData: true,
      mapResult(result: ProjectApiResponse) {
        return {
          data: result?.results || [],
          hasMore: result.next != null,
          pageSize: 25,
        };
      },
    },
  );

  useEffect(() => {
    if (error) {
      showToast(Toast.Style.Failure, "There's an issue loading projects.", error.message);
    }
  }, [error]);

  const getWorkspaceName = (workspaceId: number) => {
    if (workspace && workspace !== "0") return ""; // When the user selects a workspace in the filter.
    const projectWorkspace = workspaces.find((ws) => ws.id === workspaceId);
    return projectWorkspace ? projectWorkspace.title : "";
  };

  return (
    <List
      isLoading={isLoading}
      pagination={pagination}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Projects"
      searchBarAccessory={
        workspaceData && (
          <List.Dropdown tooltip="Select Workspace" value={workspace} onChange={setWorkspace}>
            {workspaces.map((ws) => (
              <List.Dropdown.Item key={ws.id} title={ws.title} value={String(ws.id)} />
            ))}
          </List.Dropdown>
        )
      }
    >
      {data && data.length > 0 ? (
        data.map((project: Project) => (
          <ProjectListItem
            key={project.id}
            project={{
              ...project,
              workspaceName: getWorkspaceName(project.workspace),
            }}
          />
        ))
      ) : (
        <List.EmptyView title="No projects available" description="No projects found or failed to load." />
      )}
    </List>
  );
}
