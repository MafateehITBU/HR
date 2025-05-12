import prisma from "../../config/prisma.js";

// Create a new performance review
export const createPerformanceReview = async (req, res) => {
  const {
    employeeId,
    reviewerId,
    reviewDate,
    score,
    comments,
    reviewPeriod,
    reviewStatus,
  } = req.body;

  // Check if employee and reviewer exist
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  const reviewer = await prisma.employee.findUnique({
    where: { id: reviewerId },
  });
  if (!employee || !reviewer) {
    return res.status(404).json({ error: "Employee or reviewer not found" });
  }

  // Check if employee and reviewer are the same
  if (employeeId === reviewerId) {
    return res.status(400).json({ error: "Employee cannot review themselves" });
  }

  // Check if review period is valid
  const validReviewPeriods = ["quarterly", "annual"];
  if (!validReviewPeriods.includes(reviewPeriod)) {
    return res
      .status(400)
      .json({ error: "Invalid review period, must be quarterly or annual" });
  }

  // Check if review status is valid
  const validReviewStatuses = ["scheduled", "inProgress", "completed"];
  if (!validReviewStatuses.includes(reviewStatus)) {
    return res.status(400).json({
      error:
        "Invalid review status, must be scheduled, inProgress or completed",
    });
  }

  try {
    const performanceReview = await prisma.performanceReview.create({
      data: {
        employeeId,
        reviewerId,
        reviewDate: new Date(reviewDate),
        score,
        comments: [comments],
        reviewPeriod,
        reviewStatus,
      },
    });

    res.status(201).json({
      message: "Performance review created successfully",
      performanceReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create performance review" });
  }
};

// Get all performance reviews
export const getAllPerformanceReviews = async (req, res) => {
  try {
    const performanceReviews = await prisma.performanceReview.findMany({
      include: {
        // get only the name of the employee and reviewer
        employee: {
          select: {
            name: true,
          },
        },
        reviewer: {
          select: { name: true },
        },
      },
    });

    res.status(200).json({
      message: "Performance reviews retrieved successfully",
      performanceReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve performance reviews" });
  }
};

// Get a performance review by ID
export const getPerformanceReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const performanceReview = await prisma.performanceReview.findUnique({
      where: { id: Number(id) },
      include: {
        // get only the name of the employee and reviewer
        employee: {
          select: {
            name: true,
          },
        },
        reviewer: {
          select: { name: true },
        },
      },
    });

    if (!performanceReview) {
      return res.status(404).json({ error: "Performance review not found" });
    }

    res.status(200).json({
      message: "Performance review retrieved successfully",
      performanceReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve performance review" });
  }
};

// Update a performance review
export const updatePerformanceReview = async (req, res) => {
  const { id } = req.params;
  const {
    employeeId,
    reviewerId,
    reviewDate,
    score,
    comments,
    reviewPeriod,
    reviewStatus,
  } = req.body;

  try {
    // Fetch the existing review
    const existingReview = await prisma.performanceReview.findUnique({
      where: { id: Number(id) },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Performance review not found" });
    }

    const updateData = {};
    if (employeeId) updateData.employeeId = employeeId;
    if (reviewerId) updateData.reviewerId = reviewerId;
    if (reviewDate) updateData.reviewDate = new Date(reviewDate);
    if (score !== undefined) updateData.score = score;
    if (reviewPeriod) updateData.reviewPeriod = reviewPeriod;
    if (reviewStatus) updateData.reviewStatus = reviewStatus;

    // Merge old comments with new one
    if (comments) {
      updateData.comments = [...(existingReview.comments || []), comments];
    }

    const performanceReview = await prisma.performanceReview.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "Performance review updated successfully",
      performanceReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update performance review" });
  }
};

// Delete a performance review
export const deletePerformanceReview = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.performanceReview.delete({
      where: { id: Number(id) },
    });

    res
      .status(200)
      .json({ message: "Performance review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete performance review" });
  }
};
