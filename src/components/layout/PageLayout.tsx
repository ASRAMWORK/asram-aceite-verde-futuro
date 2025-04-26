
import NavBar from "@/components/home/NavBar";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showDecoration?: boolean;
}

const PageLayout = ({ children, title, subtitle, showDecoration = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="pt-24 pb-16 relative overflow-hidden bg-gradient-to-b from-asram-100/30 to-transparent">
        {showDecoration && (
          <>
            <div className="absolute top-12 right-0 w-72 h-72 bg-asram/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-20 w-64 h-64 bg-asram-600/5 rounded-full blur-3xl -z-10" />
          </>
        )}
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-asram-800 bg-clip-text text-transparent bg-gradient-to-r from-asram-800 to-asram"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl text-gray-700 max-w-3xl"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="container mx-auto px-4 py-12"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default PageLayout;
