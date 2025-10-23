import { useState } from 'react';

const UploadCV = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    onUpload(e.target.files[0]);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700">Upload CV (PDF)</label>
      <input type="file" accept=".pdf" onChange={handleChange} className="border p-2 w-full" />
    </div>
  );
};

export default UploadCV;