const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/projectController");

router.post("/", auth, ctrl.createProject);
router.get("/", auth, ctrl.getProjects);
router.get("/:id/members", auth, ctrl.getMembers);
router.post("/:id/members", auth, ctrl.addMember);
router.delete("/:id/members/:userId", auth, ctrl.removeMember);

module.exports = router;
