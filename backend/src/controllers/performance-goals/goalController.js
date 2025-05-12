import prisma from "../../config/prisma.js";

// Helper: to validate assignedToType
const validateAssignment = (
  assignedToType,
  assignedToTeamId,
  assignedToEmployeeId
) => {
  if (!["TEAM", "EMPLOYEE"].includes(assignedToType)) {
    return "assignedToType must be either 'TEAM' or 'EMPLOYEE'";
  }

  const teamId = assignedToTeamId ? Number(assignedToTeamId) : null;
  const employeeId = assignedToEmployeeId ? Number(assignedToEmployeeId) : null;

  if (
    (teamId && employeeId) || // Both provided
    (!teamId && !employeeId) // Neither provided
  ) {
    return "Provide either Team ID or Employee ID, not both or neither";
  }

  if (assignedToType === "TEAM" && !teamId) {
    return "Team ID is required for TEAM type";
  }

  if (assignedToType === "EMPLOYEE" && !employeeId) {
    return "Employee ID is required for EMPLOYEE type";
  }

  return null;
};

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      priority,
      assignedToTeamId,
      assignedToEmployeeId,
      assignedToType,
    } = req.body;

    // Basic required fields
    if (!title || !startDate || !endDate || !priority || !assignedToType) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const validationError = validateAssignment(
      assignedToType,
      assignedToTeamId,
      assignedToEmployeeId
    );
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        priority,
        assignedToType,
        assignedToTeamId:
          assignedToType === "TEAM" ? Number(assignedToTeamId) : null,
        assignedToEmployeeId:
          assignedToType === "EMPLOYEE" ? Number(assignedToEmployeeId) : null,
      },
    });

    // Create a new goal track
    await prisma.goalTrack.create({
      data: {
        goalId: goal.id,
      },
    });

    res.status(201).json({ message: "Goal created successfully", goal });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating goal", error: error.message });
    console.error(error);
  }
};

// Get all goals
export const getAllGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      include: {
        team: true,
        employee: true,
        goalTracks: true,
      },
    });
    res.status(200).json({ message: "Goals fetched successfully", goals });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching goals", error: error.message });
  }
};

// Get goal by ID
export const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await prisma.goal.findUnique({
      where: { id: Number(id) },
      include: {
        team: true,
        employee: true,
        goalTracks: true,
      },
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal fetched successfully", goal });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching goal", error: error.message });
  }
};

// Update goal
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      priority,
      assignedToTeamId,
      assignedToEmployeeId,
      assignedToType,
    } = req.body;

    // Only validate assignment if both type and ID are provided
    if (assignedToType && (assignedToEmployeeId || assignedToTeamId)) {
      const validationError = validateAssignment(
        assignedToType,
        assignedToTeamId,
        assignedToEmployeeId
      );
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
    }

    // Build update data object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (priority !== undefined) updateData.priority = priority;

    // Only update assignment if type is provided
    if (assignedToType) {
      updateData.assignedToType = assignedToType;
      updateData.assignedToTeamId =
        assignedToType === "TEAM" ? Number(assignedToTeamId) : null;
      updateData.assignedToEmployeeId =
        assignedToType === "EMPLOYEE" ? Number(assignedToEmployeeId) : null;
    }

    const goal = await prisma.goal.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({ message: "Goal updated successfully", goal });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating goal", error: error.message });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    // First delete the goal track associated with the goal
    await prisma.goalTrack.deleteMany({
      where: { goalId: Number(id) },
    });

    // Then delete the goal
    await prisma.goal.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting goal", error: error.message });
  }
};
