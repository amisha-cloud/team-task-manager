const prisma = require("../config/prisma");

exports.createTask = async (req, res) => {
  try {
    const { description, dueDate, priority, projectId, assignedTo } = req.body;
    const title = req.body.title?.trim();
    const parsedProjectId = parseInt(projectId);
    const parsedAssignedTo = parseInt(assignedTo);

    if (!title || !dueDate || !priority || !parsedProjectId || !parsedAssignedTo) {
      return res.status(400).json({
        error: "Title, due date, priority, project, and assignee are required",
      });
    }

    if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) {
      return res.status(400).json({ error: "Invalid priority" });
    }

    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ error: "Invalid due date" });
    }

    const project = await prisma.project.findUnique({
      where: { id: parsedProjectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isAdmin = await prisma.projectMember.findFirst({
      where: {
        projectId: parsedProjectId,
        userId: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: "Only admin can create tasks" });
    }

    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId: parsedProjectId,
        userId: parsedAssignedTo,
      },
    });

    if (!isMember) {
      return res
        .status(400)
        .json({ error: "Assigned user is not a member of this project" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description?.trim() || null,
        dueDate: parsedDueDate,
        priority,
        projectId: parsedProjectId,
        assignedTo: parsedAssignedTo,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });

    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Task creation failed" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { userId: req.user.id },
    });

    const adminProjectIds = memberships
      .filter((membership) => membership.role === "ADMIN")
      .map((membership) => membership.projectId);
    const memberProjectIds = memberships
      .filter((membership) => membership.role !== "ADMIN")
      .map((membership) => membership.projectId);

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { projectId: { in: adminProjectIds } },
          { projectId: { in: memberProjectIds }, assignedTo: req.user.id },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Fetch failed" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const isAdmin = await prisma.projectMember.findFirst({
      where: {
        projectId: task.projectId,
        userId: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin && task.assignedTo !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Update failed" });
  }
};
