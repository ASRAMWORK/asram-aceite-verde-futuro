
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ServiceInfoProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ServiceInfo = ({ title, description, icon: Icon }: ServiceInfoProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-asram" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceInfo;
