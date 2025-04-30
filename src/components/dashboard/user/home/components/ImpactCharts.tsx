
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState, useEffect } from "react";

const ImpactCharts = () => {
  const { profile } = useUserProfile();
  const [recyclingData, setRecyclingData] = useState([
    { distrito: "Centro", litros: 2500 },
    { distrito: "Salamanca", litros: 1800 },
    { distrito: "Chamberí", litros: 2200 },
    { distrito: "Retiro", litros: 1900 },
    { distrito: "Chamartín", litros: 2100 },
  ]);

  // If user has a distrito, add their contribution to highlight it
  useEffect(() => {
    if (profile?.distrito && profile?.litrosAportados) {
      const userDistrict = profile.distrito;
      
      // Check if user district exists in the data
      const districtExists = recyclingData.some(item => 
        item.distrito.toLowerCase() === userDistrict.toLowerCase()
      );
      
      if (districtExists) {
        // Update existing district with user contribution
        setRecyclingData(prev => prev.map(item => 
          item.distrito.toLowerCase() === userDistrict.toLowerCase() 
            ? {...item, litros: item.litros + (profile.litrosAportados || 0)} 
            : item
        ));
      } else {
        // Add user district if it doesn't exist
        setRecyclingData(prev => [
          ...prev, 
          { distrito: userDistrict, litros: profile.litrosAportados || 0 }
        ]);
      }
    }
  }, [profile]);

  // Calculate participation percentage based on actual user data
  const userParticipationPercentage = profile?.puntosVerdes ? Math.min(profile.puntosVerdes / 10, 30) : 15;
  
  const participationData = [
    { name: "Participan", value: userParticipationPercentage, color: "#ee970d" },
    { name: "No Participan", value: 100 - userParticipationPercentage, color: "#f3f4f6" },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-[#ee970d]/10">
        <CardHeader>
          <CardTitle className="text-[#ee970d]">Reciclaje por Distrito</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recyclingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="distrito" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  borderColor: "#ee970d", 
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                labelStyle={{ 
                  color: "#ee970d",
                  fontWeight: "bold"
                }}
              />
              <Legend />
              <Bar dataKey="litros" fill="#ee970d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-[#ee970d]/10">
        <CardHeader>
          <CardTitle className="text-[#ee970d]">Participación Ciudadana</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={participationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {participationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderColor: "#ee970d", 
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default ImpactCharts;
