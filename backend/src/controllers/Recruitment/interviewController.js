import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all interviews
const getInterviews = async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        applicant: true,
        candidateDetails: true
      }
    });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single interview
const getInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await prisma.interview.findUnique({
      where: { id: parseInt(id) },
      include: {
        applicant: true,
        candidateDetails: true
      }
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create interview
const createInterview = async (req, res) => {
  try {
    const {
      applicantId,
      interviewersIds,
      interviewDate,
      location,
      status,
      feedback
    } = req.body;
    
    // Validate required fields
    if (!applicantId || !interviewersIds || !interviewDate || !status) {
      return res.status(400).json({ 
        message: 'Applicant ID, interviewers IDs, interview date, and status are required' 
      });
    }
    
    // Check if applicant exists
    const applicant = await prisma.applicant.findUnique({
      where: { id: parseInt(applicantId) }
    });
    
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    const interview = await prisma.interview.create({
      data: {
        applicantId: parseInt(applicantId),
        interviewersIds: interviewersIds.map(id => parseInt(id)),
        interviewDate: new Date(interviewDate),
        location,
        status,
        feedback
      }
    });
    
    // Fetch the created interview with relations
    const createdInterview = await prisma.interview.findUnique({
      where: { id: interview.id },
      include: {
        applicant: true,
        candidateDetails: true
      }
    });
    
    res.status(201).json(createdInterview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update interview
const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      applicantId,
      interviewersIds,
      interviewDate,
      location,
      status,
      feedback
    } = req.body;
    
    // Check if interview exists
    const existingInterview = await prisma.interview.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // If applicantId is being updated, verify the new applicant exists
    if (applicantId) {
      const applicant = await prisma.applicant.findUnique({
        where: { id: parseInt(applicantId) }
      });
      
      if (!applicant) {
        return res.status(404).json({ message: 'Applicant not found' });
      }
    }
    
    const interview = await prisma.interview.update({
      where: { id: parseInt(id) },
      data: {
        ...(applicantId && { applicantId: parseInt(applicantId) }),
        ...(interviewersIds && { interviewersIds: interviewersIds.map(id => parseInt(id)) }),
        ...(interviewDate && { interviewDate: new Date(interviewDate) }),
        ...(location && { location }),
        ...(status && { status }),
        ...(feedback && { feedback })
      }
    });
    
    // Fetch the updated interview with relations
    const updatedInterview = await prisma.interview.findUnique({
      where: { id: interview.id },
      include: {
        applicant: true,
        candidateDetails: true
      }
    });
    
    res.json(updatedInterview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete interview
const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if interview exists
    const interview = await prisma.interview.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    await prisma.interview.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview
};
