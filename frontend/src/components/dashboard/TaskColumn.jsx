import TaskCard from "./TaskCard";

export default function TaskColumn({ title, tasks, refresh }) {
  return (
    <div className="column">
      <h3>{title}</h3>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} refresh={refresh} />
      ))}
    </div>
  );
}