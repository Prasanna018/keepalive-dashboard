import useSWR from "swr";

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export function useUser() {
  const token = localStorage.getItem("keepalive_token");

  const { data, error, isLoading } = useSWR<User>(
    token ? "/auth/me" : null
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    error: error,
  };
}
