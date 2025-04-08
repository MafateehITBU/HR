import prisma from "../../config/prisma.js";

// Create a team
export const createTeam = [
  async (req, res) => {
    const { teamName, teamLead, depId } = req.body;

    if (!teamName || !depId) {
      return res
        .status(400)
        .json({ message: "Team name and department ID are required" });
    }

    try {
      const team = await prisma.team.create({
        data: {
          teamName,
          teamLead: teamLead ? parseInt(teamLead) : null,
          depId: parseInt(depId),
        },
      });
      if (!team) {
        return res.status(400).json({ message: "Team not created" });
      }
      res.status(200).json({ message: "Team created successfully", team });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get all teams
export const getAllTeams = [
  async (req, res) => {
    try {
      const teams = await prisma.team.findMany({
        include: {
          _count: {
            select: { employees: true },
          },
          teamLeadEmployee: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!teams) {
        return res.status(400).json({ message: "No teams found" });
      }

      // Transform the response to include empCount and teamLeadName
      const teamsWithCount = teams.map((team) => ({
        ...team,
        empCount: team._count.employees,
        teamLeadName: team.teamLeadEmployee?.name || null,
      }));

      res.status(200).json({
        message: "Teams fetched successfully",
        teams: teamsWithCount,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Get a team by ID
export const getTeamById = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const team = await prisma.team.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: { employees: true },
          },
          teamLeadEmployee: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!team) {
        return res.status(400).json({ message: "Team not found" });
      }

      // Transform the response to include empCount and teamLeadName
      const teamWithCount = {
        ...team,
        empCount: team._count.employees,
        teamLeadName: team.teamLeadEmployee?.name || null,
      };

      res.status(200).json({
        message: "Team fetched successfully",
        team: teamWithCount,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
      console.log(error);
    }
  },
];

// Update a team by ID
export const updateTeam = [
  async (req, res) => {
    const { id } = req.params;
    const { teamName, teamLead, depId } = req.body;

    try {
      // Create update data object with only the fields that are provided
      const updateData = {};
      if (teamName !== undefined) updateData.teamName = teamName;
      if (teamLead !== undefined)
        updateData.teamLead = teamLead ? parseInt(teamLead) : null;
      if (depId !== undefined) updateData.depId = parseInt(depId);

      const team = await prisma.team.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      if (!team) {
        return res.status(400).json({ message: "Team not found" });
      }
      res.status(200).json({ message: "Team updated successfully", team });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];

// Delete a team by ID
export const deleteTeam = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const team = await prisma.team.delete({
        where: { id: parseInt(id) },
      });
      if (!team) {
        return res.status(400).json({ message: "Team not found" });
      }
      res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  },
];
