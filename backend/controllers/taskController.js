const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId, assignedTo } =
      req.body;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Only admin can create task
    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: "Only admin can create tasks" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        projectId,
        assignedTo,
      },
    });

    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Task creation failed" });
  }
};

// GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assignedTo: req.user.id },
          { project: { adminId: req.user.id } },
        ],
      },
    });

    res.json(tasks);
  } catch {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// UPDATE TASK STATUS
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Only assigned user or admin can update
    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
    });

    if (task.assignedTo !== req.user.id && project.adminId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updated = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
};
