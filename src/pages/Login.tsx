
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import NavBar from "@/components/home/NavBar";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow dash-gradient flex items-center justify-center p-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
