const Results = ({ analysis }) => {
  if (!analysis) return null;
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded">
      <h2 className="text-xl font-bold">Analysis Results</h2>
      <pre className="whitespace-pre-wrap">{analysis}</pre>
    </div>
  );
};

export default Results;