export const getAllJobs = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/job/getAllJobs`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};
