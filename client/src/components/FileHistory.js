import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FileHistory() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to view your file history.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/files/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch file history");
        }

        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error(err);
        alert("Error loading file history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-300">Loading file history...</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-indigo-400">
        Your File Upload History
      </h2>

      {files.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="border border-gray-600 px-4 py-2 text-left">
                  Filename
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left">
                  Uploaded At
                </th>
                <th className="border border-gray-600 px-4 py-2 text-left">
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id} className="even:bg-gray-800 odd:bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2 break-words max-w-xs">
                    {file.name}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {new Date(file.uploadedAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <a
                      href={`http://localhost:5000/uploads/${file.path}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FileHistory;
