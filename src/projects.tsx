import { UserProvider } from "./context/UserContext";
import { APIAccessProvider } from "./context/APIAccessContext";
import ProjectList from "./components/projectList";

export default function Command() {
  return (
    <APIAccessProvider>
      <UserProvider>
        <ProjectList />
      </UserProvider>
    </APIAccessProvider>
  );
}
