import React, { useEffect, useState } from "react";
import { getAnalysisCount } from "../lib/publicLogs";

const AnalysisCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getAnalysisCount().then(setCount);
  }, []);

  return <div>{count}+</div>;
};

export default AnalysisCount;