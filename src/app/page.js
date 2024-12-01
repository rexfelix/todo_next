import ProtectedRoute from "@/components/ProtectedRoute";
import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <ProtectedRoute>
      <TodoApp />
    </ProtectedRoute>
  );
}
