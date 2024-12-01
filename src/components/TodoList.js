import TodoItem from './TodoItem';

export default function TodoList({
  title,
  todos,
  toggleTodo,
  changePriority,
  deleteTodo,
  getPriorityStyle,
  isCompleted = false
}) {
  return (
    <div className={isCompleted ? '' : 'mb-8'}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            changePriority={changePriority}
            deleteTodo={deleteTodo}
            getPriorityStyle={getPriorityStyle}
            isCompleted={isCompleted}
          />
        ))}
      </ul>
    </div>
  );
} 