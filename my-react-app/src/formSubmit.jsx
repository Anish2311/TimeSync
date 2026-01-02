// import { Link } from "react-router-dom";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Menu } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
// Adding file upload into the form
// Replace your existing form with this updated version

import { Input } from "@/components/ui/input";

const week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']


export default function UploadForm({onSubmit , isLoading}) {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(3);
  const [maxp, setMaxp] = useState(1);
  const [table, setTable] = useState([]);
  const [file, setFile] = useState(null);
  const form = useForm()

  
  const handleGenerate = () => {
    const newTable = Array.from({ length: Number(rows) }, () => Array(Number(cols)).fill('0'));
    setTable(newTable);
    // console.log(table,rows,cols);
    
  };

  const updateCell = (r, c, value) => {
    const updated = [...table];
    updated[r][c] = value;
    setTable(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log(file, Number(rows), Number(cols), table);
    if (!file) return alert("Select a file first!");
    onSubmit({file, rows, cols , table, maxp})
  };

  return (
    <div className="w-full flex justify-center py-10 " style={{
      // height: "80vh",
      maxHeight: "80vh",
      display: "flex",
      // alignItems: "center",
      justifyContent: "center",
      overflowY: "hidden"
    }}>
      <Card className="w-full max-w-xl shadow-md rounded-2xl max-h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Upload XLSX File
          </CardTitle>
        </CardHeader>

        <CardContent  style={{overflowY: "scroll"}}>
          <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>Select File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".xlsx"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            <div className="flex w-full gap-6">
            <FormField
                name="rows"
                render={() => (
                  <FormItem className="flex-1">
                    <FormLabel>Number of Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter rows"
                        value={rows}
                        min={1}
                        max={7}
                        onChange={(e) => setRows(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            <FormField
                name="columns"
                render={() => (
                  <FormItem className="flex-1">
                    <FormLabel>Number of Periods</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter columns"
                        value={cols}
                        min={3}
                        max={15}
                        onChange={(e) => setCols(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
              <FormField
                name="maxp"
                render={() => (
                  <FormItem className="flex-1">
                    <FormLabel>Max periods for a subject per day</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter max periods"
                        value={maxp}
                        min={1}
                        max={cols}
                        onChange={(e) => setMaxp(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            <Button disabled={isLoading} type="button" onClick={handleGenerate}>Choose Layout</Button>

            {table.length > 0 && (
              <div className="overflow-scroll border rounded p-2">
                <table className="text-sm border-collapse table-fixed">
                  <tbody>
                    {table.map((row, r) => (
                      <tr key={r}>
                        <td className="border p-2 font-small">{week[r]}</td>
                        {row.map((val, c) => (
                          <td key={c} className="border p-1">
                            <Input
                              value={val}
                              
                              onChange={(e) => updateCell(r, c, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {table.length > 0 && (
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                disabled={isLoading}
              >
                Submit
              </button>
            )}
          </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  );
}
