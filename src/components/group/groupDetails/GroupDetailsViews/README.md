# HeaderGroupDeTails Component

A hero card displaying detailed information about a group, built with **MUI**.

---

## Features

- Shows **group name** with avatar icon.  
- Quick stats including **students count, grade, price, day & time, place, exams**.  
- Includes **update button** for editing group details.  
- Integrates **StudentsFetchGroup** for listing students.  
- Fully styled for **light & dark mode**.

---

## Props / State Used

| Name | Type | Description |
|------|------|-------------|
| `GroupById` | object | Group object containing `name`, `grade`, `price`, `day`, `time`, `place`, `studentIds`. |
| `students` | array | Optional list of students in the group. |

---

# StudentsFetchGroup Component

Displays the list of students in a group with search and action buttons.

---

## Features

- Accordion layout for **expand/collapse** students.  
- **Search input** filters students by name, phone, or grade.  
- Each student card shows: **name, grade, phone, parent phone, payment status**.  
- **Action buttons** per student:  
  - `BtnRemoveStudentFromGroup` – Remove from group  
  - `TransFerStdBtwGroups` – Transfer to another group  
- Shows fallback UI when **no students exist**.  
- Fully styled for **light & dark mode**.

---

## Props / State Used

| Name | Type | Description |
|------|------|-------------|
| `students` | array | List of student objects. |
| `grade` | string | Group grade, used for filtering or display. |
| `groupName` | string | Name of the group for actions. |

---

# TransFerStdBtwGroups Component

A modal dialog for transferring a student from one group to another, using **MUI** and **Redux**.

---

## Features

- Opens via **transfer button** with tooltip.  
- Displays **student info** (name, phone).  
- **Searchable grid** of eligible groups for transfer.  
- Shows **success** and **error messages** from API calls.  
- Cancel and Transfer actions with **loading states**.  
- Fully styled for **light & dark mode**.

---

## Props / State Used

| Name | Type | Description |
|------|------|-------------|
| `student` | object | Student object containing `_id`, `name`, `phone`, `grade`. |
| `grade` | string | Optional grade filter for fetching groups. |
| `id` | string | Current group ID from `useParams`. |
| `dispatch` | function | Redux dispatch function. |
| `loadingTransferStuent` | boolean | Shows loading while transferring student. |
| `errorTransferStuent` | string | Shows API error message if transfer fails. |
| `success` | boolean | Shows success alert after transfer. |

---

## Event Handlers

- `handleOpenDialog()` → Opens transfer modal and fetches eligible groups.  
- `handleCloseDialog()` → Closes modal and resets state.  
- `handleSelectGroup()` → Calls Redux action to transfer student, shows success, refreshes group.
