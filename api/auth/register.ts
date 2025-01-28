import axios from "axios";
export const register = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/register",
        {
            companyName : name,
            email,
            password,
        }
        );
        return response.data;
    }
    catch(error : any) {
        return error.response.data;
    }
}