import { useState, useEffect } from "react";
import { http } from "@/lib/http";


interface UseGetResult<T> {
  data: T | undefined;
  loading: boolean;
  error: any;
  refetch: () => void;
  setData: React.Dispatch<React.SetStateAction<T | undefined>>
}

export function useGet<T = unknown>(
  url: string
): UseGetResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get<T>(url);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchData();
  }, [url]);
  return { data, loading, error, refetch: fetchData ,setData};
}
