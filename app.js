let employees = JSON.parse(localStorage.getItem('employees')) || [];

const employeeForm = document.getElementById('employeeForm');
const employeeTable = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('searchInput');
const departmentFilter = document.getElementById('departmentFilter');

function displayEmployees() {
    employeeTable.innerHTML = '';
    const filteredEmployees = employees.filter(employee => 
        employee.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
        (departmentFilter.value === '' || employee.department === departmentFilter.value)
    );

    filteredEmployees.forEach(employee => {
        const row = employeeTable.insertRow();
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${employee.designation}</td>
            <td>
                <button class="edit-btn" onclick="editEmployee(${employee.id})">Edit</button>
                <button class="delete-btn" onclick="deleteEmployee(${employee.id})">Delete</button>
            </td>
        `;
    });
}

function addEmployee(employee) {
    if (employees.some(emp => emp.email === employee.email)) {
        alert('Email already exists! Please use a unique email.');
        return;
    }
    employee.id = Date.now();
    employees.push(employee);
    saveEmployees();
    displayEmployees();
}

function updateEmployee(updatedEmployee) {
    const index = employees.findIndex(emp => emp.id === parseInt(updatedEmployee.id));
    if (index !== -1) {
        if (employees.some(emp => emp.email === updatedEmployee.email && emp.id !== parseInt(updatedEmployee.id))) {
            alert('Email already exists! Please use a unique email.');
            return;
        }
        employees[index] = {...employees[index], ...updatedEmployee};
        saveEmployees();
        displayEmployees();
    }
}


function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        saveEmployees();
        displayEmployees();
    }
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('name').value = employee.name;
        document.getElementById('email').value = employee.email;
        document.getElementById('department').value = employee.department;
        document.getElementById('designation').value = employee.designation;
        employeeForm.querySelector('button').textContent = 'Update Employee';
    }
}

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

employeeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const employee = {
        id: document.getElementById('employeeId').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        designation: document.getElementById('designation').value
    };

    if (employee.id) {
        updateEmployee(employee);
    } else {
        addEmployee(employee);
    }

    employeeForm.reset();
    document.getElementById('employeeId').value = '';
    employeeForm.querySelector('button').textContent = 'Add Employee';
});

searchInput.addEventListener('input', displayEmployees);
departmentFilter.addEventListener('change', displayEmployees);

displayEmployees();