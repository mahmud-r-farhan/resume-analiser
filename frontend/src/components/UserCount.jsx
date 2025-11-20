import React, { useEffect, useState } from 'react';
import { getUserCount } from '../lib/publicLogs';

const UserCount = () => {
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const count = await getUserCount();
        setUserCount(count);
      } catch (err) {
        setError('Failed to fetch user count');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  if (loading) {
    return <div>...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
       {userCount}+
    </div>
  );
};

export default UserCount;