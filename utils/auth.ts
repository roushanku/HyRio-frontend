// utils/auth.ts
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

export const handleLogout = () => {
  const router = useRouter();

  // Remove token from cookie
  deleteCookie("token", {
    path: "/",
  });

  // Redirect to login page
  router.push("/login");
};
