import { useState, useEffect } from "react";
import { createTask } from "../../api/taskApi";
import { getProjectMembers } from "../../api/projectApi";

export default function CreateTask({ projectId, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getProjectMembers(projectId);
        console.log("Fetched members:", res.data);
        setMembers(res.data);
      } catch (err) {
        console.log("Error fetching members:", err);
      }
    };
    if (projectId) fetchMembers();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !assignedTo || !dueDate) {
      alert("Please fill all required fields");
      return;
    }

    if (members.length === 0) {
      alert("No project members available. Please add members to the project first.");
      return;
    }

    try {
      setLoading(true);
      await createTask({
        title,
        description,
        dueDate,
        priority,
        projectId,
        assignedTo: Number(assignedTo),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("MEDIUM");
      setAssignedTo("");

      if (refresh) refresh();
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.error || "Error creating task";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-grid">
        <input
          type="text"
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          min={new Date().toISOString().split('T')[0]}
        />

        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
          <option value="">Assign to... *</option>
          {members.map(m => (
            <option key={m.userId} value={m.userId}>
              {m.user?.name || `User ${m.userId}`} ({m.role})
            </option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating Task..." : "Create Task"}
      </button>
    </form>
  );
}