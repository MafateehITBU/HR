import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all candidates
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        interview: true
      }
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get candidate by ID
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { id: parseInt(id) },
      include: {
        interview: true
      }
    });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new candidate
export const createCandidate = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      educationHistory,
      skills,
      certificates,
      resume,
      interviewRecords,
      interviewId,
      status
    } = req.body;

    // First check if the interview exists
    const interview = await prisma.interview.findUnique({
      where: { id: parseInt(interviewId) }
    });

    if (!interview) {
      return res.status(400).json({ 
        error: 'Interview not found. Please provide a valid interview ID.' 
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        educationHistory,
        skills,
        certificates,
        resume,
        interviewRecords,
        interviewId: parseInt(interviewId),
        status
      },
      include: {
        interview: true
      }
    });
    res.status(201).json(candidate);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'A candidate with this email already exists.' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      educationHistory,
      skills,
      certificates,
      resume,
      interviewRecords,
      interviewId,
      status
    } = req.body;

    // Check if the interview exists when updating
    if (interviewId) {
      const interview = await prisma.interview.findUnique({
        where: { id: parseInt(interviewId) }
      });

      if (!interview) {
        return res.status(400).json({ 
          error: 'Interview not found. Please provide a valid interview ID.' 
        });
      }
    }

    const candidate = await prisma.candidate.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        educationHistory,
        skills,
        certificates,
        resume,
        interviewRecords,
        interviewId: interviewId ? parseInt(interviewId) : undefined,
        status
      },
      include: {
        interview: true
      }
    });
    res.json(candidate);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'A candidate with this email already exists.' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.candidate.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.status(500).json({ error: error.message });
  }
}; 