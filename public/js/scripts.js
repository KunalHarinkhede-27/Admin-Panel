const socket = io();

// Handle the 'updateEmployees' event when the employee list is updated
socket.on('updateEmployees', () => {
    console.log('Employee list updated!');
    
    // Fetch the updated employee list from the server
    fetch('/api/employees')
        .then((res) => res.json())
        .then((employees) => {
            const tbody = document.querySelector('.employee-table tbody');
            if (!tbody) {
                console.error('Employee table body not found.');
                return;
            }

            tbody.innerHTML = ''; // Clear current table rows

            // Loop through each employee and add rows to the table
            employees.forEach((employee) => {
                tbody.innerHTML += `
                    <tr data-id="${employee._id}">
                        <td>${employee.uniqueId}</td>
                        <td>${employee.name}</td>
                        <td>${employee.email}</td>
                        <td>${employee.mobile}</td>
                        <td>${employee.designation}</td>
                        <td>${employee.gender}</td>
                        <td>
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </td>
                    </tr>
                `;
            });

            // Reapply search functionality after table update
            searchEmployees();
        })
        .catch((err) => console.error('Error fetching employees:', err));
});

// Adjust layout based on screen size
function adjustLayout() {
    const tableContainer = document.querySelector('.table-container');
    const cardContainer = document.querySelector('.employee-cards');

    if (!tableContainer || !cardContainer) {
        console.error('Table or card container not found.');
        return;
    }

    if (window.innerWidth < 768) {
        tableContainer.style.display = 'none';  // Hide the table
        cardContainer.style.display = 'block';  // Show the cards
    } else {
        tableContainer.style.display = 'block'; // Show the table
        cardContainer.style.display = 'none';   // Hide the cards
    }
}

// Standalone search function for filtering employees
function searchEmployees() {
    const searchInput = document.getElementById('search');
    const filter = searchInput.value.toLowerCase(); // Convert input to lowercase
    const rows = document.querySelectorAll('.employee-table tbody tr');

    if (!rows) {
        console.error('Employee table rows not found.');
        return;
    }

    rows.forEach((row) => {
        const rowText = row.textContent.toLowerCase(); // Combine all cell text in the row
        
        // If the search input is empty, show all rows
        if (filter === "") {
            row.style.display = ""; // Show all rows
        } else {
            // Otherwise, show only rows that match the filter
            row.style.display = rowText.includes(filter) ? "" : "none";
        }
    });

    console.log('Search applied with filter:', filter); // Debugging log
}

// Example Usage
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', searchEmployees); // Apply search on input
});