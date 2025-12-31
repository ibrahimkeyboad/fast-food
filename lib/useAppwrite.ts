import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseAppwriteOptions<T, P extends Record<string, string | number | undefined>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number | undefined>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  // FIX: Use a stringified version of params as the dependency
  // This ensures the effect only runs when the values inside params actually change
  const paramsString = JSON.stringify(params);

  useEffect(() => {
    if (!skip) {
      fetchData(JSON.parse(paramsString));
    }
  }, [fetchData, paramsString, skip]); // Depend on the string, not the object

  const refetch = async (newParams?: P) => await fetchData(newParams || params);

  return { data, loading, error, refetch };
};

export default useAppwrite;
