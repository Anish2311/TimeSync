import { useState } from "react";
import UploadForm from "./formSubmit";

export default function FileUploader({ onUpload }) {
  // const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async ({ file, rows, cols, table, maxp }) => {
    if (!file) return;

    // 1 MB limit
    const MAX_SIZE = 1 * 1024 * 1024; // 1 MB in bytes
    if (file.size > MAX_SIZE) {
      alert("File size exceeds 1 MB limit. Please choose a smaller file.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("rows", Number(rows));
    formData.append("cols", Number(cols));
    formData.append("maxp", Number(maxp));
    formData.append("layouts", JSON.stringify(table));

    try {
      const res = await fetch("https://timesync-api.vishvamcodes.com/upload", {
        method: "POST",
        // mode: "cors",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const result = await res.json();
      console.log(result);
      onUpload(result);

    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };



  // const element = (
  //   <div className="flex flex-col gap-10 p-4">
  //     {Object.entries(result["classes"]).map(([name, data]) => (
  //       <div key={name}>
  //         <h2 className="text-xl font-semibold">{name}</h2>
  //         <ArrayTableVisualizer arr = {data} />
  //       </div>
  //     ))}
  //     {Object.entries(result["techers"]).map(([name, data]) => (
  //       <div key={name}>
  //         <h2 className="text-xl font-semibold">{name}</h2>
  //         <ArrayTableVisualizer arr = {data} />
  //       </div>
  //     ))}
  //   </div>
  // );


  return (
    <div>
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "baseline" }}>
          <h1 style={{ fontSize: "4rem", marginTop: "2rem", fontFamily: "sans-serif" }}>TimeSync</h1>
          <img className="animate-spin" style={{ maxWidth: "10rem", height: "4rem", margin: "1rem" }} src="./../logo.png" alt="" />
        </div>
      )}
      {isLoading == false && (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "baseline" }}>
          <h1 style={{ fontSize: "4rem", marginTop: "2rem", fontFamily: "sans-serif" }}>TimeSync</h1>
          <img style={{ maxWidth: "10rem", height: "4rem", margin: "1rem" }} src="./../logo.png" alt="" />
        </div>
      )}

      <UploadForm onSubmit={handleUpload} isLoading={isLoading}></UploadForm>

    </div>
  );
}
