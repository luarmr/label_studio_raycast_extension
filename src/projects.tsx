import { UserProvider } from "./context/UserContext";
import ProjectList from "./components/projectList";

export default function Command() {
  return (
    <UserProvider>
      <ProjectList />
    </UserProvider>
  );
}
