const prisma = require("../config/prisma");

exports.createProject = async (req, res) => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        createdBy: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: "ADMIN",
          },
        },
      },
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { userId: req.user.id },
      include: {
        project: true,
      },
      orderBy: {
        project: {
          createdAt: "desc",
        },
      },
    });

    const projects = memberships.map((membership) => ({
      ...membership.project,
      currentUserRole: membership.role,
    }));

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "You are not a member of this project" });
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        role: "asc",
      },
    });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Member email is required" });
    }

    const isAdmin = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return res.status(404).json({
        message: "No registered user found with this email. Ask them to sign up first, then add them again.",
      });
    }

    const existing = await prisma.projectMember.findFirst({
      where: { projectId, userId: userToAdd.id },
    });

    if (existing) {
      return res.status(400).json({ message: "User already a member" });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        role: "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    if (userId === req.user.id) {
      return res.status(400).json({ message: "Admin cannot remove themselves" });
    }

    const isAdmin = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: req.user.id,
        role: "ADMIN",
      },
    });

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    const memberToRemove = await prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!memberToRemove) {
      return res.status(404).json({ message: "Member not found in this project" });
    }

    if (memberToRemove.role === "ADMIN") {
      return res.status(400).json({ message: "Project admin cannot be removed" });
    }

    await prisma.projectMember.deleteMany({
      where: { projectId, userId },
    });

    res.json({ message: "Member removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
