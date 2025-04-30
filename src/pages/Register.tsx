
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import NavBar from "@/components/home/NavBar";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow dash-gradient flex items-center justify-center p-6">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
