import axios from "axios";
import { getCookie } from "cookies-next";

interface JobData {
  title: string;
  description: string;
  salary: number;
  experienceLevel: string;
  location: string;
  companyId?: string;
}

export const createJob = async (jobData: JobData) => {
  jobData.companyId = (await getCookie("companyId")) as string;
  const token = (await getCookie("token")) as string;
  console.log(token);
  console.log(jobData);
  const body = {
    companyId: jobData.companyId,
    title: jobData.title,
    description: jobData.description,
    salary: jobData.salary,
    experienceLevel: jobData.experienceLevel,
    location: jobData.location,
  };
  const response = await axios.post(
    "http://10.50.40.217:8000/api/job/createNewJob",
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
};
