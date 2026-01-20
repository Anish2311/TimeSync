import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader
} from "@/components/ui/sidebar";
import Graph from "./Graph";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import StatsGrid from "./Stats"
import DropdownTable from "./Editor";

let tData = {}
let tConfig = {}

const week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']


export default function TimetableLayout({ data }) {
  
  const [teacherFilter, setTeacherFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  
  const items = [];
  
  
  for (const [key, value] of Object.entries(data.techers)) {
    // console.log(value);
    
    tData[key] = []
    for(let j = 0; j < value.length; j++){
      let c = 0
      for(let i = 0; i < value[0].length; i++){
        if(value[j][i].trim().length != 0){
          c += 1
        }
      }
      tData[key].push({'day':week[j],'periods':c})
    }
  }
  
  for (const [key, value] of Object.entries(data.classes)) {
    // console.log(value);
    
    tData[key] = []
    for(let j = 0; j < value.length; j++){
      let c = 0
      for(let i = 0; i < value[0].length; i++){
        if(value[j][i].trim().length != 0){
          c += 1
        }
      }
      tData[key].push({'day':week[j],'periods':c})
    }
  }
  
  tConfig = {
    periods: {
      label: "Periods",
      color: "#82c9d4ff",
    },
  };
  
  for (const key of Object.keys(data.techers || {})) {
    items.push({
      id: key,
      type: "teacher",
      subject: data.subjects[key]
    });
  }
  
  for (const key of Object.keys(data.classes || {})) {
    items.push({
      id: key,
      type: "class",
      grade: key.slice(0,-1)
    });
  }
  const [selected, setSelected] = useState({ type: items[0].type, id: items[0].id });

  const teacherSubjects = [
    "All",
    ...new Set(items.filter(i => i.type === "teacher").map(i => i.subject)),
  ];

  const classGrades = [
    "All",
    ...new Set(items.filter(i => i.type === "class").map(i => i.grade)),
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden">
     
      <Sidebar className="border-r">
        <SidebarHeader style={{maxWidth: "40px",margin: "8px"}}> <img src="./../logo.png" alt="" /> </SidebarHeader>
        <SidebarContent>

          {/* Teachers Group */}
          <SidebarGroup>
            <SidebarGroupLabel>Teachers</SidebarGroupLabel>

            {/* SUBJECT DROPDOWN */}
            <select
              className="mb-2 w-full rounded border p-1 text-[14px]"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
            >
              {teacherSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <SidebarMenu>
              {items
                .filter(i => i.type === "teacher")
                .filter(i => teacherFilter === "All" || i.subject === teacherFilter)
                .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setSelected({ type: item.type, id: item.id })}
                      style={{padding: "0.8rem"}}
                    >
                      {item.id}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Classes Group */}
          <SidebarGroup>
            <SidebarGroupLabel>Classes</SidebarGroupLabel>

            {/* GRADE DROPDOWN */}
            <select
              className="mb-2 w-full rounded border p-1 text-[14px]"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              {classGrades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <SidebarMenu>
              {items
                .filter(i => i.type === "class")
                .filter(i => classFilter === "All" || i.grade === classFilter)
                .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setSelected({ type: item.type, id: item.id })}
                    >
                      {item.id}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>

        </SidebarContent>
      </Sidebar>
      <div className="flex-1 p-6 flex-2 justify-center items-start overflow-auto">
        <ScrollArea className="h-full w-full">
          {selected && (
            <TimetableTable
            title={`${selected.id}`}
            rows={
              selected.type === "teacher"
              ? data.techers[selected.id]
              : data.classes[selected.id]
            }
            subj = {data.subjects}
            sall = {data.studallotment}
            tall = {data.teallotment}
            tables = {data}
            />
          )}
        </ScrollArea>
      </div>
    </div>
  );
}


function TimetableTable({ title, rows, subj, sall, tall, tables}) {
    let t = 0
    for(let i =0 ; i < tData[title].length; i++){
      t += tData[title][i]['periods']
    }

    const pastelPalette = [
      "#7F8AE8",
      "#8BA3D0",
      "#86C3B8",
      "#A5D38D",
      "#D9C77E",
      "#E5A27E",
      "#D08BAA",
      "#B38CCF"
    ];

    const tableRef = useRef(null);

    const downloadPNG = async () => {
      if (!tableRef.current) return;

      const dataUrl = await htmlToImage.toPng(tableRef.current, {
        cacheBust: true,
        backgroundColor: "#0f0f0f",
      });

      const link = document.createElement("a");
      link.download = `${title}_TT.png`;
      link.href = dataUrl;
      link.click();
    };


    const subjectColorMap = {};
    const [notEditing, setEditing] = useState(true);


    function getSubjectColor(subject) {
      if (subject == ' ' || subject == '   ') return "transparent";
      if (subjectColorMap[subject]) return subjectColorMap[subject];

      const keys = Object.keys(subjectColorMap);
      const nextColor = pastelPalette[keys.length % pastelPalette.length];

      subjectColorMap[subject] = nextColor;
      return nextColor;
    }




    const periodHeaders = Array.from({ length: rows[Object.keys(rows)[0]].length }, (_, i) => `P${i + 1}`);
    if(notEditing){
      console.log("NOT EDITING");
      
      return (
          <div className="max-w-full flex flex-col">
          <Card className="rounded-[1rem] shadow-lg overflow-hidden">
              <h1 style={{fontSize: "1.2rem"
                        }}>{ title }</h1>
              <CardContent className="p-4 overflow-auto max-h-[70vh]">
                <div ref = {tableRef}>
                  <button onClick={(e) => setEditing(false)}>Edit</button>
                  <table className="w-full text-sm border-collapse table-fixed">
                    <thead>
                        <tr>
                          <th></th> {/* Empty corner cell */}
                          {periodHeaders.map((p, index) => (
                            <th key={index} style={{ padding: "6px 12px", textAlign: "center" }}>
                              {p}
                            </th>
                          ))}
                        </tr>
                    </thead>
  
                    <tbody> 
                        {rows?.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-100/10">
                              <td style={{ fontWeight: "bold", textAlign: "center" }}>
                                {week[i]}
                              </td>
  
                                {row.map((cell, j) => (
                                    <td
                                    key={j}
                                    className="border text-center w-24"
                                    style={{
                                      backgroundColor: getSubjectColor(cell),
                                      color: "white",
                                      // borderColor: "#1e293b",
                                    }}
                                    >
                                    <div className="min-h-[2.4rem] flex items-center justify-center">
                                      {cell}
                                    </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
          <div className="flex flex-row p-6 items-start overflow-auto gap-16">
            <div className="w-1/2 h-1/2">
              <Graph chartConfig={tConfig} chartData={tData[title]}></Graph>
            </div>
            <div className="w-1/2 h-1/2">
              <Card>
                <CardTitle>Stats</CardTitle>
                <CardContent>
                  <div className="flex flex-row max-w-full gap-0">
                    <div className="flex flex-col w-[30%] gap-4">
                        <p className="text-left">Total Slots : {t}</p>
                        {/* <p className="flex-1 w-96">Classes handling : {}</p> */}
                        <button
                          onClick={downloadPNG}
                          className="self-start bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Download PNG
                        </button>
  
                    </div >
                    <div className="flex flex-row gap-2 w-[70%] h-[10rem]" style={{overflowX: "scroll"}}>
                        {title in subj
                        ? <StatsGrid title="Teacher allocation" stats={tall[title]}></StatsGrid>
                        : <StatsGrid title="Teacher allocation" stats={sall[title]}></StatsGrid>
                        }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </Card>
          </div>
      );
    }
    else{
      return (
        <div>
          <button onClick={(e) => setEditing(true)}>Edit</button>
          <DropdownTable initialTableData={rows} options={title in subj
                        ? tall[title].map(list => list[1])
                        : sall[title].map(list => list[0])
                        }
                        tableS={tables} titlE={title}></DropdownTable>
        </div>
      )
    }
}
