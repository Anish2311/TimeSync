import './App.css'
import React, { use, useState } from "react";
import FileUploader from "./FileUploader";
import TimetableLayout from "./SidebarTabs";
import './fonts.css';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ErrorPopup } from "./ErrorPopup"

const FIELDS = [
  "teach1",
  "teach2",
  "teach3",
  "teach4",
  "teach5"
]

function App() {
  const [result, setResult] = useState(null);

  function handleUpload(data) {
    setResult(data);
  }


  if (!result) {
    return (
      <div className="p-6">
       
        <FileUploader onUpload={handleUpload} />
      </div>
    );
  }
  if (result.error){
    return (
      <ErrorPopup
        open={Boolean(result.error)}
        title="Error!!"
        onClose={() => setResult(null)}
        message={result.error}
      />
    )
  }
  


  return (
    <div>
      <header className="sticky top-0 z-0 h-14 border-b bg-background">
        <div className="flex h-full">
          <div className="w-64" /> {/* sidebar spacer */}
          <div className="flex flex-1 items-center px-4">
            <span style={{ fontSize: "1.4rem", fontFamily: "sans-serif" }}>
              TimeSync
            </span>
            
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-3.5rem)] overflow-hidden">
        <SidebarProvider>
          <TimetableLayout data={result} />
        </SidebarProvider>
      </main>

    </div>
  );
}

export default App;
