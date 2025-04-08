import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all applicants
const getApplicants = async (req, res) => {
  try {
    const applicants = await prisma.applicant.findMany({
      include: {
        jobPosting: true,
        interviews: true
      }
    });
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single applicant
const getApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await prisma.applicant.findUnique({
      where: { id: parseInt(id) },
      include: {
        jobPosting: true,
        interviews: true
      }
    });
    
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create applicant
const createApplicant = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      resumeURL,
      jobPostingId,
      coverLetter,
      applicationSource,
      status = 'PENDING'
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !jobPostingId) {
      return res.status(400).json({ message: 'Name, email, and jobPostingId are required' });
    }
    
    // Check if job posting exists
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: parseInt(jobPostingId) }
    });
    
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    
    const applicant = await prisma.applicant.create({
      data: {
        name,
        email,
        phone,
        resumeURL,
        jobPostingId: parseInt(jobPostingId),
        coverLetter,
        applicationSource,
        status
      }
    });
    
    res.status(201).json(applicant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update applicant
const updateApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      resumeURL,
      jobPostingId,
      coverLetter,
      applicationSource,
      status
    } = req.body;
    
    // Check if applicant exists
    const existingApplicant = await prisma.applicant.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingApplicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    // If jobPostingId is being updated, verify the new job posting exists
    if (jobPostingId) {
      const jobPosting = await prisma.jobPosting.findUnique({
        where: { id: parseInt(jobPostingId) }
      });
      
      if (!jobPosting) {
        return res.status(404).json({ message: 'Job posting not found' });
      }
    }
    
    const applicant = await prisma.applicant.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(resumeURL && { resumeURL }),
        ...(jobPostingId && { jobPostingId: parseInt(jobPostingId) }),
        ...(coverLetter && { coverLetter }),
        ...(applicationSource && { applicationSource }),
        ...(status && { status })
      }
    });
    
    res.json(applicant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete applicant
const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if applicant exists
    const applicant = await prisma.applicant.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    
    await prisma.applicant.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getApplicants,
  getApplicant,
  createApplicant,
  updateApplicant,
  deleteApplicant
}; 