import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

type GitHubResponse = {
  description: string;
};

// TODO add react suspense
const Example = () => {
  const { isLoading, error, data } = useQuery<GitHubResponse>(
    ["repoData"],
    () =>
      fetch("https://api.github.com/repos/tannerlinsley/react-query").then(
        (res) => res.json()
      )
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>error has occured</span>;
  }

  return <span>{data?.description}</span>;
};

export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}
