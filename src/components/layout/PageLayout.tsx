
import NavBar from "@/components/home/NavBar";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const PageLayout = ({ children, title, subtitle }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="pt-24 pb-16 bg-gradient-to-b from-asram-100/30 to-transparent">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-asram-800">{title}</h1>
          {subtitle && (
            <p className="mt-4 text-xl text-gray-700 max-w-3xl">{subtitle}</p>
          )}
        </div>
      </div>
      <main className="container mx-auto px-4 py-12">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
