import axios from 'axios';

/**
 * Fetch total commits using GitHub REST API.
 * This ensures we get lifetime commits without complex GraphQL pagination.
 */
const fetchTotalCommits = async (username, token) => {
  try {
    const res = await axios.get(`https://api.github.com/search/commits?q=author:${username}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview",
        Authorization: `bearer ${token}`,
      },
    });
    return res.data.total_count || 0;
  } catch (error) {
    console.error("Error fetching commits:", error?.response?.data || error.message);
    return 0;
  }
};

/**
 * Fetch main GitHub stats using GraphQL.
 */
export const fetchStats = async (username, token) => {
  const query = `
    query userInfo($login: String!) {
      user(login: $login) {
        name
        login
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
          nodes {
            stargazers {
              totalCount
            }
          }
        }
        pullRequests(first: 1) {
          totalCount
        }
        issues(first: 1) {
          totalCount
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

    const user = res.data.data.user;
    
    // Sum all stars from repositories
    const totalStars = user.repositories.nodes.reduce((acc, repo) => {
      return acc + repo.stargazers.totalCount;
    }, 0);

    const totalCommits = await fetchTotalCommits(username, token);

    return {
      name: user.name || user.login,
      totalStars,
      totalCommits,
      totalPRs: user.pullRequests.totalCount,
      totalIssues: user.issues.totalCount
    };
  } catch (err) {
    console.error("Error fetching stats:", err.message);
    throw new Error("Failed to fetch GitHub data.");
  }
};
