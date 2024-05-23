import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface UseFetchResponse<T> {
  data: T | null;
  error: AxiosError | null;
  loading: boolean;
}

const useFetch = <T,>(url: string): UseFetchResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, loading };
};

export default useFetch;
