import express from "express";
import GroupController from "../Controllers/GroupController";
import isGroupMember from "../Middlewares/isGroupMember";
import isGroupAdmin from "../Middlewares/isGroupAdmin";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const creatorId = req.user.id;
    const group = await GroupController.createGroup(creatorId, name);
    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:groupId/members", isGroupMember, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, pageSize = 10, searchTerm = "" } = req.query;

    const members = await GroupController.getGroupMembers(
      groupId,
      parseInt(page.toString()),
      parseInt(pageSize.toString()),
      searchTerm.toString()
    );

    res.json({
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/:groupId/add-member/:userId", isGroupAdmin, async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    await GroupController.addUserToGroup(groupId, userId);
    res.status(200).send("User added to group");
  } catch (error) {
    res.status(400).send(`Error adding user to group: ${error.message}`);
  }
});

router.delete(
  "/:groupId/remove-member/:userId",
  isGroupAdmin,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const groupId = req.params.groupId;

      const removedUser = await GroupController.removeUserFromGroup(
        userId,
        groupId
      );

      res
        .status(200)
        .json({ message: "User removed from group", data: removedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, searchTerm = "" } = req.query;
    const groups = await GroupController.getGroups(
      Number(page),
      Number(pageSize),
      searchTerm
    );
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:groupId", isGroupMember, async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await GroupController.getGroup(groupId);
    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:groupId", isGroupAdmin, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name } = req.body;
    const group = await GroupController.updateGroup(groupId, name);
    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", isGroupAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const group = await GroupController.deleteGroup(id);
    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
