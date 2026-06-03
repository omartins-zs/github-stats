import axios from 'axios';

/**
 * Fetch top languages for a given username using GraphQL.
 */
export const fetchTopLanguages = async (username, token, langsCount = 6) => {
  const query = `
    query userInfo($login: String!) {
      user(login: $login) {
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes {
            name
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  color
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await axios.post(
      'https://api.github.com/graphql',
      { query, variables: { login: username } },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (res.data.errors) {
      console.error(res.data.errors);
      throw new Error(res.data.errors[0]?.message || "GraphQL Error");
    }

    let repoNodes = res.data.data.user.repositories.nodes;

    const topLangs = repoNodes
      .filter((node) => node.languages.edges.length > 0)
      .reduce((acc, curr) => curr.languages.edges.concat(acc), [])
      .reduce((acc, prev) => {
        let langSize = prev.size;

        if (acc[prev.node.name] && prev.node.name === acc[prev.node.name].name) {
          langSize = prev.size + acc[prev.node.name].size;
        }

        return {
          ...acc,
          [prev.node.name]: {
            name: prev.node.name,
            color: prev.node.color || '#858585',
            size: langSize,
          },
        };
      }, {});

    // Sort by size and trim to requested count
    const sortedLangs = Object.values(topLangs)
      .sort((a, b) => b.size - a.size)
      .slice(0, langsCount);

    const totalLanguageSize = sortedLangs.reduce((acc, curr) => acc + curr.size, 0);

    return { langs: sortedLangs, totalSize: totalLanguageSize };
  } catch (err) {
    console.error("Error fetching top languages:", err.message);
    throw new Error("Failed to fetch top languages from GitHub.");
  }
};
