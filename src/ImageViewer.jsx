import React, { useState } from "react";


export default function ImageViewer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const WEBHOOK_URL =
    "https://shreyahubcredo.app.n8n.cloud/webhook/009f42dc-b706-4eb7-988d-c59cc8ca4e3f";


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }


    setLoading(true);
    setResult(null);


    try {
      const formData = new FormData();
      formData.append("file", selectedFile);


      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });


      if (!response.ok) throw new Error("Failed to process image");


      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Image Analysis Dashboard</h2>


      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img src={preview} alt="preview" className="w-64 h-64 mt-4 rounded-md object-contain border" />
      )}


      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Send to n8n"}
      </button>


      {result && (
        <div className="mt-6 w-full">
          <p className="font-semibold">Processed Image:</p>
          <img
            src={`data:image/png;base64,${result.image}`}
            alt="Processed"
            className="w-80 h-80 mt-2 rounded-md object-contain border"
          />


          <div className="mt-4">
            <h3 className="font-bold mb-1">Extracted Text:</h3>
            <pre className="bg-gray-200 p-3 rounded-md text-sm overflow-x-auto">{result.text}</pre>
          </div>


          <div className="mt-4">
            <h3 className="font-bold mb-1">Detected Errors:</h3>
            {result.errors.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2">Error Text</th>
                    <th className="border-b py-2">Type</th>
                    <th className="border-b py-2">Suggestion</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err, i) => (
                    <tr key={i}>
                      <td className="border-b py-1">{err.found_text}</td>
                      <td className="border-b py-1">{err.error_type}</td>
                      <td className="border-b py-1">{err.suggested_correction || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No errors detected 🎉</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
