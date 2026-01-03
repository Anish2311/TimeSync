# TimeSync  
**Automated Timetable Generator for Educational Institutions**

TimeSync is a web-based system for generating **conflict-free academic timetables** for schools and colleges.  
It produces **class-wise and teacher-wise timetables simultaneously**, based on structured input data and user-defined constraints.

---

## ✨ Key Features

- **Simultaneous Scheduling**
  - Generates timetables for **all classes and all teachers** in a single run
- **Constraint-Based Engine**
  - Supports block periods, shared periods, and custom layouts
- **Statistics & Insights**
  - Detailed stats for every class and teacher
- **Export Options**
  - Download generated timetables as PNG images

---

## 📥 Inputs

### 1. Excel Data File (Required)

All scheduling data must be uploaded as an **`.xlsx` file** following a predefined format.

📎 A sample file is provided to demonstrate the required structure:  
`sample_input.xlsx`

The file typically includes:
- Classes
- Subjects
- Teachers
- Subject–teacher mappings
- Required periods per subject

> **Note:** Uploading files that do not follow the specified format may result in errors or invalid outputs.

---

### 2. Scheduling Parameters

After uploading the Excel file, provide the following inputs:

1. **Number of Days**  
   Total working days in the timetable cycle.

2. **Number of Periods**  
   Periods per day.

3. **Maximum Periods per Subject per Day**  
   Upper limit for how many times a subject can appear in a single day.

4. **Layout**  
   A grid defining period-level constraints.

---

## 📐 Layout Specification

The layout is a grid where:
- Rows represent **days**
- Columns represent **periods**

Each cell corresponds to a single timetable slot.

### Rules

- **`0`**  
  No constraint. The slot can be filled freely.

- **Any other string (e.g., `A`, `LAB`)**  
  All slots **on the same day** containing the same string will be assigned:
  - The same subject
  - The same teacher  

This is primarily used for **block periods**, labs, or grouped sessions.

### Example

| Day | P1 | P2 | P3 | P4 |
|-----|----|----|----|----|
| 1   | 0  | A  | A  | 0  |

Here, periods **P2 and P3** on Day 1 form a block period.

---

## ⚙️ Execution Notes

- Timetables are generated using a constraint-solving approach.
- Both **class-level** and **teacher-level** conflicts are resolved automatically.

---

## ⏱️ Performance Considerations

- **Highly constrained schedules**  
  - May take up to **~2 minutes** to compute

- **Moderately or lightly constrained schedules**  
  - Typically complete in **under 10 seconds**

Computation time depends on the complexity and strictness of constraints.

---

## 📤 Output

- View generated timetables directly in the web interface
- Download timetables as **PNG**
- Access statistics such as:
  - Subject distribution
  - Teacher workload
  - Period utilization

---

## 🛠️ Tech Stack

- **Frontend:** React
- **Backend:** FastAPI
- **Scheduling Engine:** Constraint-based solver
- **Deployment:** HTTPS-enabled API

---

## 📌 Notes

- Ensure all required inputs are provided before submission.
- Start with relaxed constraints and incrementally add stricter rules for best results.

---
