import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FileHistory() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in to view your file history.');
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/files/history', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch file history');
        }

        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error(err);
        alert('Error loading file history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) return <p>Loading file history...</p>;

  return (
    <div>
      <h2>Your File Upload History</h2>

      {files.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Uploaded At</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td>{file.name}</td>
                <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/${file.path}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FileHistory;
