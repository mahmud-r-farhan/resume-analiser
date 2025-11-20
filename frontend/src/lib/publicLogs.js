const BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/public`;

// Fetch upload logs
export const getUploadLogs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/uploadlogs`);
    if (!response.ok) {
      throw new Error('Failed to fetch upload logs');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fetch user count
export const getUserCount = async () => {
  try {
    const response = await fetch(`${BASE_URL}/usercount`);
    if (!response.ok) {
      throw new Error('Failed to fetch user count');
    }
    const data = await response.json();
    return data.userCount;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

// Fetch analysis count
export const getAnalysisCount = async () => {
  try {
    const response = await fetch(`${BASE_URL}/analyses/count`);
    const { count } = await response.json();
    return count;
  } catch (err) {
    console.error(err);
    return 0;
  }
};
