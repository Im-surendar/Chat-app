// Generic GraphQL POST request function

const GRAPHQL_ENDPOINT = "https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphql";

export const createMessage = async (query: string, variables?: any) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((e: any) => e.message).join("\n"));
  }

  return json.data;
};
