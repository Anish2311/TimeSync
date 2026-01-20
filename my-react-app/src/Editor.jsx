import { useState, useEffect } from "react";
import ErrorList from "./Error";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { title } from "process";

export default function DropdownTable({
  initialTableData,
  options,
  tableS,
  titlE
}) {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState([]);

//   options.push(' ')

  // 🔑 CRITICAL FIX
  useEffect(() => {
    if (initialTableData?.length) {
      setTableData(initialTableData.map(row => [...row]));
    }
  }, [initialTableData]);

  function updateCell(r, c, value) {
    checkUp(r, c, value)
    setTableData(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = value;
      return next;
    });
  }

  function checkUp(r, c, value){
    if(titlE in tableS.teallotment){
      if(value != " " && (tableS.classes[value][r][c] != ' ' && tableS.classes[value][r][c] != '   ') && tableS.classes[value][r][c] != value){
        setError(prev => [
          ...prev,
          {
            type: "CLASS_CLASH",
            message: `${value} assigned to ${tableS.classes[value][r][c]} already`,
            row: r,
            col: c,
            severity: "error",
          },
        ]);
      }
      else{
        tableS.classes[value][r][c] = titlE
      }
    }
  }
  
  const periodHeaders = Array.from({ length: initialTableData[Object.keys(initialTableData)[0]].length }, (_, i) => `P${i + 1}`);

  if (!tableData.length) return null;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
        <TableRow>
            {/* <TableHead> </TableHead> */}
            {periodHeaders.map((p, index) => (
            <TableHead key={index} style={{ padding: "6px 12px", textAlign: "center" }}>{p}</TableHead>
            ))}
        </TableRow>
      </TableHeader>
        <TableBody>
          {tableData.map((row, r) => (
            <TableRow key={r}>
              {/* <TableCell> </TableCell> */}
              {row.map((cellValue, c) => {
                const cellOptions =
                  typeof options === "function"
                    ? options(r, c)
                    : options;

                return (
                  <TableCell key={c} className="p-2">
                    <Select
                      value={cellValue || ""}
                      onValueChange={value =>
                        updateCell(r, c, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {cellOptions.map(opt => (
                          <SelectItem
                            key={opt}
                            value={opt}
                          >
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ErrorList errors={error}></ErrorList>
    </div>
  );
}
