const JobDescription = ({ onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700">Paste Job Description</label>
      <textarea onChange={(e) => onChange(e.target.value)} className="border p-2 w-full h-32" />
    </div>
  );
};

export default JobDescription;