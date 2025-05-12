import prisma from "../../config/prisma.js";

// Create a regulation
export const createRegulation = async (req, res) => {
  const { title, description, status, regulationDate, responsiblePartyId } =
    req.body;
  try {
    // check if all fields are provided
    if (!title || !status || !regulationDate || !responsiblePartyId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // check if the responsible party exists
    const responsibleParty = await prisma.employee.findUnique({
      where: { id: responsiblePartyId },
    });
    if (!responsibleParty) {
      return res.status(400).json({ error: "Responsible party not found" });
    }
    // Check if the status is valid
    if (status !== "compliant" && status !== "nonCompliant") {
      return res
        .status(400)
        .json({ error: "Invalid status, must be compliant or nonCompliant" });
    }
    // Create the regulation
    const regulation = await prisma.regulation.create({
      data: {
        title,
        description,
        status,
        regulationDate: new Date(regulationDate),
        responsiblePartyId,
      },
    });
    res.status(201).json({
      message: "Regulation created successfully",
      regulation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create regulation" });
  }
};

// Get all regulations
export const getAllRegulations = async (req, res) => {
  try {
    const regulations = await prisma.regulation.findMany({
      include: {
        responsibleParty: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Regulations retrieved successfully",
      regulations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get all regulations" });
  }
};

// Get a regulation by ID
export const getRegulationById = async (req, res) => {
  const { id } = req.params;
  try {
    const regulation = await prisma.regulation.findUnique({
      where: { id: Number(id) },
      include: {
        responsibleParty: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!regulation) {
      return res.status(404).json({ error: "Regulation not found" });
    }

    res.status(200).json({
      message: "Regulation retrieved successfully",
      regulation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get regulation by ID" });
  }
};

// Update a regulation
export const updateRegulation = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, regulationDate, responsiblePartyId } =
    req.body;
  try {
    // Check if the status is valid
    if (status && status !== "compliant" && status !== "nonCompliant") {
      return res
        .status(400)
        .json({ error: "Invalid status, must be compliant or nonCompliant" });
    }

    // Create an object with only the provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (regulationDate !== undefined)
      updateData.regulationDate = new Date(regulationDate);
    if (responsiblePartyId !== undefined) {
      updateData.responsiblePartyId = responsiblePartyId;
      // check if the responsible party exists
      const responsibleParty = await prisma.employee.findUnique({
        where: { id: responsiblePartyId },
      });
      if (!responsibleParty) {
        return res.status(400).json({ error: "Responsible party not found" });
      }
    }

    // Update the regulation
    const updatedRegulation = await prisma.regulation.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "Regulation updated successfully",
      updatedRegulation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update regulation" });
  }
};

// Delete a regulation
export const deleteRegulation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.regulation.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Regulation deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete regulation" });
  }
};
