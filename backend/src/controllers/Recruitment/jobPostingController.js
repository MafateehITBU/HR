import prisma from '../../config/prisma.js';

// Get all job postings
const getJobPostings = async (req, res) => {
  try {
    const jobPostings = await prisma.jobPosting.findMany({
      include: {
        jobTitle: true,
        applicants: true,
        jobPostingTrack: true
      }
    });
    res.json(jobPostings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job posting
const getJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: parseInt(id) },
      include: {
        jobTitle: true,
        applicants: true,
        jobPostingTrack: true
      }
    });
    
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    
    res.json(jobPosting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create job posting
const createJobPosting = async (req, res) => {
  try {
    const {
      jobTitleId,
      employmentType,
      salaryRange,
      location,
      jobRequirements,
      deadline,
      status = 'ACTIVE'
    } = req.body;
    
    const jobPosting = await prisma.jobPosting.create({
      data: {
        jobTitleId: parseInt(jobTitleId),
        employmentType,
        salaryRange,
        location,
        jobRequirements,
        deadline: deadline ? new Date(deadline) : null,
        status
      }
    });
    
    // Create job posting track
    await prisma.jobPostingTrack.create({
      data: {
        jobPostingId: jobPosting.id,
        applicantsCount: 0,
        interviews: 0,
        hiringStatus: 'PENDING'
      }
    });
    
    res.status(201).json(jobPosting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update job posting
const updateJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      jobTitleId,
      employmentType,
      salaryRange,
      location,
      jobRequirements,
      deadline,
      status
    } = req.body;
    
    const jobPosting = await prisma.jobPosting.update({
      where: { id: parseInt(id) },
      data: {
        ...(jobTitleId && { jobTitleId: parseInt(jobTitleId) }),
        ...(employmentType && { employmentType }),
        ...(salaryRange && { salaryRange }),
        ...(location && { location }),
        ...(jobRequirements && { jobRequirements }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(status && { status })
      }
    });
    
    res.json(jobPosting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete job posting
const deleteJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete the job posting track
    await prisma.jobPostingTrack.delete({
      where: { jobPostingId: parseInt(id) }
    });
    
    // Then delete the job posting
    await prisma.jobPosting.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get job posting track
const getJobPostingTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await prisma.jobPostingTrack.findUnique({
      where: { jobPostingId: parseInt(id) }
    });
    
    if (!track) {
      return res.status(404).json({ message: 'Job posting track not found' });
    }
    
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update job posting track
const updateJobPostingTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicantsCount, interviews, hiringStatus } = req.body;
    
    const track = await prisma.jobPostingTrack.update({
      where: { jobPostingId: parseInt(id) },
      data: {
        ...(applicantsCount && { applicantsCount: parseInt(applicantsCount) }),
        ...(interviews && { interviews: parseInt(interviews) }),
        ...(hiringStatus && { hiringStatus })
      }
    });
    
    res.json(track);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getJobPostings,
  getJobPosting,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
  getJobPostingTrack,
  updateJobPostingTrack
}; 