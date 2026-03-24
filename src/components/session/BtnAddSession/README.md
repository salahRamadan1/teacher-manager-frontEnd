# Add Session Component – README

This file handles **creating a new session** in the system, including selecting students, managing payments, validation, and submitting data to the backend using Redux.

---

## 📌 Overview

The component allows a teacher to:

* Create a new session for a group
* Add students to the session
* Edit student payment or notes
* Validate inputs before submission
* Prevent duplicate sessions on the same day
* Submit session data to the backend via Redux

---

## 🧱 Technologies Used

* **React Hooks** (`useState`, `useEffect`)
* **Redux Toolkit** (`useDispatch`, `useSelector`)
* **Material UI (MUI)** for UI & theming
* **Joi** for frontend validation
* **Async Thunks** for API calls

---

## 📂 Main State Structure

### `formData`

Holds all session-related data:

```js
{
  grade: String,
  place: String,
  description: String,
  sessionPrice: Number,
  centerPrice: Number,
  presentStudents: Array,
  groupId: String
}
```

### `newStudent`

Temporary student object before adding to session:

```js
{
  name: String,
  studentId: String,
  payment: Number,
  note: String
}
```

---

## 🧑‍🎓 Student Management

### Add Student

* Select student from dropdown
* Add payment & note
* Push to `presentStudents` array

### Edit Student

* Open edit dialog
* Modify payment or note
* Update student inside `presentStudents`

### Remove Student

* Remove student by index from session list

---

## 🧾 Validation

* Uses `validateCreateSession(formData)` (Joi)
* Displays frontend validation errors
* Stops submission if validation fails

---

## 🚀 Submission Flow

1. Validate form data
2. Convert prices and payments to numbers
3. Dispatch `addSession(sessionData)`
4. Handle responses:

   * ✅ Success → close modal
   * ⚠️ Session already exists → show warning

---

## 🧠 Redux State Used

From `state.session`:

* `loadingSession`
* `errorAddSession`
* `errorAddSessionNetwork`
* `messageSessionExist`
* `sessionId`

---

## 🪟 UI States

* **Add Session Modal**
* **Edit Student Dialog**
* **Success Snackbar**
* **Warning Dialog**

---

## ⚠️ Edge Cases Handled

* Prevent adding empty student
* Prevent duplicate sessions in same day
* Reset Redux state when modal closes
* Clear errors on input change

---

## 🔮 Future Improvements

* Navigate to session details page after creation
* Extract student logic into reusable hooks
* Improve performance using `useCallback`
* Add pagination for large student lists

---

## ✅ Summary

This component is responsible for **full session lifecycle management** on the frontend:
from student selection → validation → backend submission.

Well-structured, scalable, and ready for production use 🚀
