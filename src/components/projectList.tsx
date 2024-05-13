import { List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState, useEffect } from "react";
import { ProjectApiResponse, Workspace } from "../types";
import { useAPIAccess } from "../context/APIAccessContext";
import ProjectListItem from "../components/projectListItem";

export default function ProjectList() {
  const { apiToken, appURL } = useAPIAccess();
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [workspace, setWorkspace] = useState<string>("");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([{ id: 0, title: "All Projects" }]);
  const { data: workspaceData } = useFetch<Workspace[]>(`${appURL}/api/workspaces?page_size=-1`, {
    headers: { Authorization: `Token ${apiToken}` },
  });

  useEffect(() => {
    if (workspaceData) {
      setWorkspaces([{ id: 0, title: "All Projects" }, ...workspaceData]);
    }
  }, [workspaceData]);

  const { isLoading, data, pagination } = useFetch(
    (options) => {
      const page = options.page + 1;
      const pageSize = 25;
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        include: "id,title,created_at,color,is_draft,is_published,pinned_at",
        title: searchText,
      });

      if (workspace && workspace !== "0") {
        params.append("workspaces", workspace);
      }

      return `${appURL}/api/projects?${params.toString()}`;
    },
    {
      headers: { Authorization: `Token ${apiToken}` },
      initialData: {
        data: [],
        hasMore: false,
        pageSize: 25,
      },
      keepPreviousData: true,
      mapResult(result: ProjectApiResponse) {
        return {
          data: result.results || [],
          hasMore: result.next != null,
          pageSize: 25,
        };
      },
    },
  );

  function resetDetailView() {
    isDetailLoading && setIsDetailLoading(false);
  }

  return (
    <List
      isLoading={isLoading}
      pagination={pagination}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Projects"
      searchBarAccessory={
        <List.Dropdown tooltip="Select Workspace" value={workspace} onChange={setWorkspace}>
          {workspaces.map((ws) => (
            <List.Dropdown.Item key={ws.id} title={ws.title} value={String(ws.id)} />
          ))}
        </List.Dropdown>
      }
      onSelectionChange={() => resetDetailView()}
      isShowingDetail={isDetailLoading}
    >
      {data && data.length > 0 ? (
        data.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            isDetailLoading={isDetailLoading}
            setIsDetailLoading={setIsDetailLoading}
          />
        ))
      ) : (
        <List.EmptyView title="No projects available" description="No projects found or failed to load." />
      )}
    </List>
  );
}
