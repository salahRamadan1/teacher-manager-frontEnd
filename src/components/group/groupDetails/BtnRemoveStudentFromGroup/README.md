# RemoveStudentDialog Component

A modal dialog for removing a student from a group with confirmation, built with **MUI** and **Redux**.

---

## Features

- Opens via **delete button** with tooltip.  
- Displays **student info** (name, phone, grade, avatar).  
- Shows **group info** from which the student will be removed.  
- **Confirmation warning** for irreversible action.  
- Displays **success** and **error messages** from API calls.  
- Cancel and Remove actions with **loading states**.  
- Fully styled for **light & dark mode**.

---

## Props / State Used

| Name | Type | Description |
|------|------|-------------|
| `student` | object | Student object containing `_id`, `name`, `phone`, `grade`. |
| `groupName` | string | Name of the group. |
| `id` | string | Group ID from `useParams`. |
| `dispatch` | function | Redux dispatch function. |
| `loadingRemoveStudentFromGroup` | boolean | Shows loading while removing student. |
| `errorRemoveStudentFromGroup` | string | Shows API error message if removal fails. |

---

## Event Handlers

 
- `handleRemove()` → Calls Redux action to remove student, shows success, refreshes group.

---

 
