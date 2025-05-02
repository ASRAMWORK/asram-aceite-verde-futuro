
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import NavBar from "@/components/home/NavBar";
import { motion } from "framer-motion";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <motion.div 
        className="flex-grow dash-gradient flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RegisterForm />
      </motion.div>
    </div>
  );
};

export default Register;
