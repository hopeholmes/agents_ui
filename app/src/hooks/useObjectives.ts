import { useEffect, useState } from "react";
import axios from "axios";

interface Objective {
  id: number;
  title: string;
  status: string;
}

export function useObjectives() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/dashboard/objectives`);
        setObjectives(res.data.objectives || []);
      } catch (error) {
        console.error("Error fetching objectives:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchObjectives();
    const interval = setInterval(fetchObjectives, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { objectives, loading };
}
