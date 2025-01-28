import axios from "axios";

export const sendEmails = async (jobId: String, emails: Array<String>) => {
  try {
    console.log("jobId", jobId);
    console.log("emails", emails);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/email/sendEmail/${jobId}`,
      {
        emails: emails,
      }
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
