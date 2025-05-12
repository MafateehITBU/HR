import prisma from "../../config/prisma.js";

// Create a new policy
export const createPolicy = async (req, res) => {
  const { title, description, document, effectiveDate, authorId } = req.body;
  try {
    // check if all fields are provided
    if (!title || !description || !document || !effectiveDate || !authorId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // check if the author exists
    const author = await prisma.employee.findUnique({
      where: { id: authorId },
    });
    if (!author) {
      return res.status(400).json({ error: "Author not found" });
    }

    const policy = await prisma.policy.create({
      data: {
        title,
        description,
        document,
        effectiveDate: new Date(effectiveDate),
        authorId,
      },
    });
    res.status(201).json({
      message: "Policy created successfully",
      policy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create policy" });
  }
};

// Get all policies
export const getAllPolicies = async (req, res) => {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json({
      message: "Policies retrieved successfully",
      policies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get all policies" });
  }
};

// Get a policy by ID
export const getPolicyById = async (req, res) => {
  const { id } = req.params;
  try {
    const policy = await prisma.policy.findUnique({
      where: { id: Number(id) },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.status(200).json({
      message: "Policy retrieved successfully",
      policy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get policy by ID" });
  }
};

// Update a policy
export const updatePolicy = async (req, res) => {
  const { id } = req.params;
  const { title, description, document, effectiveDate, authorId } = req.body;

  try {
    // Create an object with only the provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (document !== undefined) updateData.document = document;
    if (effectiveDate !== undefined)
      updateData.effectiveDate = new Date(effectiveDate);
    if (authorId !== undefined) updateData.authorId = authorId;

    const policy = await prisma.policy.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "Policy updated successfully",
      policy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update policy" });
  }
};

// Delete a policy
export const deletePolicy = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.policy.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Policy deleted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete policy" });
  }
};
