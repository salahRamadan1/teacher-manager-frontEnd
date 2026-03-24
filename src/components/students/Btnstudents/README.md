# Student Management UI Components

This document explains all the React components and functions used in the **Student Management System**, including forms, filters, search, sorting, pagination, dialog actions, and display. The components are built using **React**, **Redux Toolkit**, and **Material-UI (MUI)**, and support **Dark/Light Mode** automatically.

---

## Table of Contents

1. [Theme & Hooks](#theme--hooks)  
2. [Student Form (Edit)](#student-form-edit)  
3. [Form Fields](#form-fields)  
4. [Display Fields](#display-fields)  
5. [Dialog Actions](#dialog-actions)  
6. [Search Input](#search-input)  
7. [Grade Filter](#grade-filter)  
8. [Sort Select](#sort-select)  
9. [Pagination](#pagination)  
10. [Reset Filters Button](#reset-filters-button)  

---

## Theme & Hooks

```javascript
const theme = useTheme();       // Access MUI theme colors, spacing, typography
const dispatch = useDispatch(); // Redux dispatch function
