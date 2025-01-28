"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Mail, Users, Briefcase } from "lucide-react";
import { createJob } from "@/api/job/create-job";
import { getAllJobs } from "@/api/job/get-all-jobs";
import { sendEmails } from "@/api/email/send-emails";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: {
    companyId: string;
    title: string;
    description: string;
    salary: string;
    experienceLevel: string;
    location: string;
  }) => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [jobData, setJobData] = useState({
    companyId: "",
    title: "",
    description: "",
    salary: "",
    experienceLevel: "",
    location: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    // onSave(jobData);
    const response = await createJob(jobData as any);
    console.log(response);
    setJobData({
      companyId: "",
      title: "",
      description: "",
      salary: "",
      experienceLevel: "",
      location: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Create Job</h2>
        <div className="space-y-4">
          <Input
            name="title"
            value={jobData.title}
            onChange={handleChange}
            placeholder="Job Title"
          />
          <Textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={4}
          />
          <Input
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
            placeholder="Salary"
          />
          <Input
            name="experienceLevel"
            value={jobData.experienceLevel}
            onChange={handleChange}
            placeholder="BEGINNER | INTERMEDIATE | EXPERT"
          />
          <Input
            name="location"
            value={jobData.location}
            onChange={handleChange}
            placeholder="REMOTE | ONSITE"
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Dialog>
  );
};

const Dashboard = () => {
  const [emails, setEmails] = useState("");
  const [status, setStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  interface Job {
    emails: any;
    _id: string;
    title: string;
    description: string;
    salary: number;
    experienceLevel: string;
    location: string;
  }

  const [jobs, setJobs] = useState<Job[]>([]);

  const handleCreateJob = (jobData: any) => {
    console.log("Job Created:", jobData);
    // Add API call to save job data here
  };

  const handleSendEmails = async (job: any) => {
    const jobEmails =
      job.emails?.split(",").map((email: string) => email.trim()) || [];
    if (
      jobEmails.length === 0 ||
      jobEmails.some((email: string) => !validateEmail(email))
    ) {
      setStatus(`Invalid email addresses for ${job.title}.`);
      return;
    }
    console.log(`Sending emails for job ${job.title}:`, jobEmails);
    const response = await sendEmails(job._id, jobEmails);
    setStatus(`Emails sent successfully for job ${job.title}!`);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllJobs();
        if (response.success) {
          setJobs(response.jobs);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Home
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Jobs Posted
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Welcome to Job Board Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsModalOpen(true)}>Create Job</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Posted Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {jobs.length > 0 ? (
                <ul className="space-y-4">
                  {jobs.map((job) => (
                    <li
                      key={job._id}
                      className="border border-gray-300 p-4 rounded-md shadow-sm"
                    >
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.description}</p>
                        <div className="text-sm text-gray-500">
                          <p>
                            <strong>Salary:</strong> $
                            {job.salary.toLocaleString()}
                          </p>
                          <p>
                            <strong>Experience Level:</strong>{" "}
                            {job.experienceLevel}
                          </p>
                          <p>
                            <strong>Location:</strong> {job.location}
                          </p>
                        </div>
                        {/* Email input and send button */}
                        <div className="mt-4 space-y-2">
                          <label
                            htmlFor={`emails-${job._id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Enter Email Addresses (comma-separated):
                          </label>
                          <input
                            type="text"
                            id={`emails-${job._id}`}
                            placeholder="example1@gmail.com, example2@gmail.com"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            onChange={(e) => {
                              const updatedJobs = jobs.map((j) =>
                                j._id === job._id
                                  ? { ...j, emails: e.target.value }
                                  : j
                              );
                              setJobs(updatedJobs);
                            }}
                          />
                          <Button
                            onClick={() => {
                              handleSendEmails(job);
                            }}
                            className="bg-indigo-600 text-white"
                          >
                            Send Email
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No jobs posted yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="emails"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter Email Addresses (comma-separated):
                  </label>
                  <input
                    type="text"
                    id="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="example1@gmail.com, example2@gmail.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <Button
                  onClick={handleSendEmails}
                  className="bg-indigo-600 text-white"
                >
                  Send Email
                </Button>
                {status && (
                  <p
                    className={`text-sm mt-2 ${
                      status.includes("Invalid")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {status}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateJob}
      />
    </div>
  );
};

export default Dashboard;
