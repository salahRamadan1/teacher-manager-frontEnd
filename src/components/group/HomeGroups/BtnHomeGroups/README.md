# BtnUpdateGroup Component

## Purpose / Function

`BtnUpdateGroup` is a React component responsible for **updating an existing group**.  
It manages fetching the group data, populating the form, handling user input, performing validation, and submitting the update to the backend.  
It integrates with **Redux**, **MUI Theme**, and provides **Light/Dark mode support**.

---

## Theme

- **`theme`**: Uses MUI's `useTheme()` hook to access colors, spacing, and adapt styles to light/dark mode.

---

## Redux

- **`dispatch`**: Used to dispatch Redux actions.
- **State from Redux** (`useSelector`):
  - `loadingGetGroupById`: Loading indicator for fetching a group.
  - `errorGetGroupById`: Backend error for fetching a group.
  - `errorGetGroupByIdNetWork`: Network error for fetching.
  - `GroupById`: The fetched group data.
  - `loadingUpdateGroup`: Loading indicator for updating a group.
  - `errorUpdateGroup`: Backend error for update action.
  - `errorUpdateGroupNetWork`: Network error for update.
  - Field-specific errors:
    - `errorUpdateGroupName`, `errorUpdateGroupPrice`, `errorUpdateGroupGrade`, `errorUpdateGroupTime`, `errorUpdateGroupDay`, `errorUpdateGroupPlace`

---

## Local UI State

| State          | Type      | Purpose |
|----------------|-----------|---------|
| `openDialog`   | boolean   | Controls visibility of the update dialog. |
| `success`      | boolean   | Indicates successful update. |
| `errors`       | object    | Stores client-side validation errors. |

---

## Static Data

- `grades`: Array of grades `["1st","2nd","3rd"]`
- `days`: Array of weekdays `["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"]`

These are used to populate dropdowns in the form.

---

## Form State

| Field      | Type      | Description |
|------------|-----------|-------------|
| `place`    | string    | Group location. |
| `name`     | string    | Group name. |
| `grade`    | string    | Grade level. |
| `time`     | string    | Time of the group. |
| `day`      | string    | Day of the week. |
| `price`    | number    | Price per session. |

- Stored in `formData` state.
- Updated dynamically by `handleChange`.

---

## Dialog Handlers

- `handleOpen()`: Opens the update dialog.
- `handleClose()`: Closes the dialog, clears errors, and resets relevant Redux state.

---

## Effects

### Fetch Group Data
```js
useEffect(() => {
    if (groupId && openDialog) {
        dispatch(getGroupById(groupId));
    }
}, [groupId, openDialog, dispatch]);
// ************
# AddGroup Component

## Purpose / Function

The `AddGroup` component is responsible for **creating a new group** in the application.  
It handles form state, input validation, Redux interactions, and provides **success/error feedback**.  
It integrates with **MUI theme** and supports **Light/Dark mode**.

---

## Theme

- **`colors`**: Custom theme colors (from your theme configuration)  
- **`theme`**: MUI `useTheme()` hook for palette, spacing, and light/dark mode adaptation

---

## Redux

- **`dispatch`**: Dispatch actions to the Redux store
- **State from Redux** (`useSelector`):
  - `errorAddGroupName`, `errorAddGroupGrade`, `errorAddGroupDay`, `errorAddGroupTime`, `errorAddGroupPlace`, `errorAddGroupPrice`: Field-specific backend errors
  - `loadingGroup`: Loading state during group creation
  - `errorAddGroup`, `errorAddGroupNetWork`: General backend/network errors
  - `loadingSuccessfully`: Indicates if the group was successfully created

- **Actions**:
  - `addGroup(formData)`: Dispatches API call to create group
  - `getGroups('/group/getGroupsByTeacher')`: Refreshes the groups list
  - `makeStateIsEmpityGroup()`: Resets Redux state for the form

---

## Local UI State

| State        | Type    | Purpose |
|--------------|---------|---------|
| `formData`   | object  | Holds the values of all form fields (place, grade, day, time, name, price) |
| `errors`     | object  | Holds frontend validation errors |
| `success`    | boolean | Shows success feedback after group creation |
| `openDialog` | boolean | Controls whether the add group dialog is open |

---

## Static Data

- `grades`: Array of grade options for the select input: `["1st","2nd","3rd"]`
- `days`: Array of day options for the select input: `["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"]`

---

## Handlers

### handleChange
```js
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  setErrors({});
  dispatch(makeStateIsEmpityGroup());
};

