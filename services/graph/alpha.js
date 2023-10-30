const THE_GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/tomasfrancizco/nof_polygon';

const query = `
  query getSeasonWinners {
    winners(first: 1000) {
      season
      winner
      position
      blockTimestamp
    }
  }
`;

export const fetchData = async () => {
  try {
    const response = await fetch(THE_GRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const json = await response.json();
    return json;
  } catch (e) {
    console.error({ e });
  }
};
