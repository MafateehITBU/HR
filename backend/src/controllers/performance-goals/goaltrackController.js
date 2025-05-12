import prisma from "../../config/prisma.js";

// Get all goal tracks
export const getAllGoalTracks = async (req, res) => {
  try {
    // get the goals title with the goalTrack
    const goalTracks = await prisma.goalTrack.findMany({
      include: {
        goal: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    res.json(goalTracks);
  } catch (error) {
    res.status(400).json({ error: "Failed to get goal tracks" });
    console.error(error);
  }
};

// Get a goal track by ID
export const getGoalTrackById = async (req, res) => {
  const { id } = req.params;
  try {
    const goalTrack = await prisma.goalTrack.findUnique({
      where: { id: parseInt(id) },
      include: { goal: true },
    });
    if (!goalTrack) {
      return res.status(404).json({ error: "Goal track not found" });
    }
    res.json(goalTrack);
  } catch (error) {
    res.status(400).json({ error: "Failed to get goal track" });
  }
};

// Update a goal track
export const updateGoalTrack = async (req, res) => {
  const { id } = req.params;
  const { progressUpdates, milestones, challenges, comments } = req.body;

  try {
    const goalTrack = await prisma.goalTrack.findUnique({
      where: { id: parseInt(id) },
    });

    if (!goalTrack) {
      return res.status(404).json({ error: "Goal track not found" });
    }

    const updatedData = {
      progressUpdates: progressUpdates
        ? [...goalTrack.progressUpdates, progressUpdates]
        : goalTrack.progressUpdates,
      milestones: milestones
        ? [...goalTrack.milestones, milestones]
        : goalTrack.milestones,
      challenges: challenges
        ? [...goalTrack.challenges, challenges]
        : goalTrack.challenges,
      comments: comments
        ? [...goalTrack.comments, comments]
        : goalTrack.comments,
    };

    const updatedGoalTrack = await prisma.goalTrack.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json(updatedGoalTrack);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update goal track" });
  }
};

// Delete a goal track
export const deleteGoalTrack = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.goalTrack.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Goal track deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete goal track" });
  }
};
