import React, { useEffect, useState } from 'react';
import { getUploadLogs } from '../lib/publicLogs';
import { CheckCircle } from 'lucide-react';

const UploadLogList = () => {
  const [uploadLogs, setUploadLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await getUploadLogs();
        setUploadLogs(logs);
      } catch (err) {
        setError('Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div>...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (uploadLogs.length === 0) {
    return <div>0+</div>;
  }

  return (
    <div>

        {uploadLogs.length}+

    </div>
  );
};

export default UploadLogList;