import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useSwr from "swr";

const queryClient = new QueryClient();

type GitHubResponse = {
  description: string;
};

const REACT_QUERY_REPO_URL =
  "https://api.github.com/repos/tannerlinsley/react-query";
// TODO add react suspense
const ReactQueryExample = () => {
  const { isLoading, error, data } = useQuery<GitHubResponse>(
    ["repoData"],
    () => fetch(REACT_QUERY_REPO_URL).then((res) => res.json())
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>error has occured</span>;
  }

  return <span>{data?.description}</span>;
};

const ReactQueryWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryExample />
    </QueryClientProvider>
  );
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const SWR_REPO_URL = "https://api.github.com/repos/vercel/swr";

const SwcExample = () => {
  const { data, error } = useSwr<GitHubResponse>(SWR_REPO_URL, fetcher);

  if (error) return <span>An error has occured</span>;
  if (!data) return <span>Loading...</span>;
  return <span>{data?.description}</span>;
};

// I don't handle errors
type CustomFetcherState<T> =
  | {
      data?: T;
      fetching: false;
    }
  | {
      data: null;
      fetching: true;
    };

const useCustomFetch = <T,>(url: string) => {
  const [state, setState] = useState<CustomFetcherState<T>>({
    data: null,
    fetching: true,
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(url);
      const json: T = await response.json();
      setState({
        data: json,
        fetching: false,
      });
    })();
  }, [url]);

  return { data: state.data, fetching: state.fetching };
};

const THIS_REPO_URL =
  "https://api.github.com/repos/kolaczyn/react-fetching-solutions";
const WithoutLibraryExample = () => {
  const { data, fetching } = useCustomFetch<GitHubResponse>(THIS_REPO_URL);

  if (fetching) return <span>Fetching...</span>;
  return <span>{data?.description}</span>;
};

export default function Index() {
  return (
    <>
      <ReactQueryWrapper />
      <hr />
      <SwcExample />
      <hr />
      <WithoutLibraryExample />
    </>
  );
}
