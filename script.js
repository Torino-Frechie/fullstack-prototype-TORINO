document.addEventListener("DOMContentLoaded", function () {

    // ================= SECTIONS & CONTAINERS =================
    const homeSection = document.getElementById("homeSection");
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const verifySection = document.getElementById("verifySection"); // Added
    const adminSection = document.getElementById("adminSection");
    const employeesSection = document.getElementById("employeesSection");
    const departmentsSection = document.getElementById("departmentsSection");
    const accountSection = document.getElementById("accountSection");
    const myRequestsSection = document.getElementById("myRequestsSection");
    
    const deptTableBody = document.getElementById("deptTableBody");
    const deptForm = document.getElementById("deptForm");
    const deptFormContainer = document.getElementById("deptFormContainer");
    
    const accountTableBody = document.getElementById("accountTableBody");
    const accountFormContainer = document.getElementById("accountFormContainer");
    const accountForm = document.getElementById("accountForm");

    const employeeTableBody = document.getElementById("employeeTableBody");
    const employeeFormContainer = document.getElementById("employeeFormContainer");
    const employeeForm = document.getElementById("employeeForm");

    const requestModal = document.getElementById("requestModal");
    const itemsContainer = document.getElementById("itemsContainer");
    const requestForm = document.getElementById("requestForm");

    const mainNavbar = document.querySelector(".navbar");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm"); // Added variable
    
    // TRACKING VARIABLES
    let editIndex = null; 
    let editDeptIndex = null;
    let editAccIndex = null;

    // ================= SHOW SECTION FUNCTION =================
    function showSection(sectionToShow) {
        const sections = [
            homeSection, loginSection, registerSection, verifySection, 
            adminSection, employeesSection, departmentsSection, 
            accountSection, myRequestsSection
        ];
        sections.forEach(s => { 
            if(s) s.style.display = "none"; 
        });
        if (sectionToShow) sectionToShow.style.display = "block";
    }

    // --- 1. Registration Redirect to Verify ---
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const firstName = registerForm.querySelectorAll("input")[0].value;
            const lastName = registerForm.querySelectorAll("input")[1].value;
            const email = registerForm.querySelectorAll("input")[2].value;
            const password = registerForm.querySelectorAll("input")[3].value;

            let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
            
            if (accounts.find(acc => acc.email === email)) {
                return alert("Email already registered!");
            }

            const newAccount = { firstName, lastName, email, password, role: "User", verified: false };
            accounts.push(newAccount);
            localStorage.setItem("accounts", JSON.stringify(accounts));
            localStorage.setItem('unverified_email', email);
            
            const userEmailSpan = document.getElementById("userEmail");
            if(userEmailSpan) userEmailSpan.innerText = email;
            
            // Ensure the success message is hidden when starting verification
            const verifiedMsg = document.getElementById('verifiedMessage');
            if(verifiedMsg) verifiedMsg.style.display = "none";

            showSection(verifySection);
        });
    }

    // --- 2. Simulate Email Verification ---
    const simulateBtn = document.getElementById('simulateBtn');
    if (simulateBtn) {
        simulateBtn.onclick = function() {
            const emailToVerify = localStorage.getItem('unverified_email');
            let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
            const userIndex = accounts.findIndex(acc => acc.email === emailToVerify);

            if (userIndex !== -1) {
                accounts[userIndex].verified = true;
                localStorage.setItem("accounts", JSON.stringify(accounts));
                
                alert("Email verified successfully!");
                
                // Only show the success message, do NOT switch sections yet
                const verifiedMsg = document.getElementById('verifiedMessage');
                if(verifiedMsg) verifiedMsg.style.display = "block";
            }
        };
    }

    // --- 3. Go to Login Button (The actual trigger) ---
    const goLoginBtn = document.getElementById('goLoginBtn');
    if (goLoginBtn) {
        goLoginBtn.onclick = function() {
            showSection(loginSection);
        };
    }

    // ================= LOGIN LOGIC =================
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = loginForm.querySelectorAll("input")[0].value;
            const password = loginForm.querySelectorAll("input")[1].value;
            
            let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
            
            // Basic Hardcoded Admin Check
            if (email === "admin@example.com" && password === "1234") {
                localStorage.setItem("loggedIn", "true");
                if (mainNavbar) mainNavbar.style.display = "none";
                return showSection(adminSection);
            }

            // Registered User Check
            const user = accounts.find(acc => acc.email === email && acc.password === password);
            if (user) {
                if (user.verified === false) {
                    alert("Please verify your email first!");
                    localStorage.setItem('unverified_email', user.email);
                    showSection(verifySection);
                    return;
                }
                localStorage.setItem("loggedIn", "true");
                if (mainNavbar) mainNavbar.style.display = "none";
                showSection(adminSection);
            } else { 
                alert("Invalid email or password"); 
            }
        });
    }

    // ================= ACCOUNTS CRUD =================
    window.renderAccounts = function() {
        const accounts = JSON.parse(localStorage.getItem("accounts")) || [
            { firstName: "Admin", lastName: "User", email: "admin@example.com", role: "Admin", verified: true }
        ];
        
        if (!accountTableBody) return;
        accountTableBody.innerHTML = "";
        accounts.forEach((acc, index) => {
            const verifiedBadge = acc.verified ? '<span class="badge-verified">✅</span>' : '<span class="badge-unverified">❌</span>';
            accountTableBody.innerHTML += `
                <tr>
                    <td>${acc.firstName} ${acc.lastName}</td>
                    <td>${acc.email}</td>
                    <td>${acc.role}</td>
                    <td>${verifiedBadge}</td>
                    <td>
                        <button onclick="editAccount(${index})" class="btn-action btn-edit">Edit</button>
                        <button onclick="resetPassword(${index})" class="btn-action btn-reset">Reset Password</button>
                        <button onclick="deleteAccount(${index})" class="btn-action btn-delete">Delete</button>
                    </td>
                </tr>`;
        });
    }

    window.editAccount = function(index) {
        const accounts = JSON.parse(localStorage.getItem("accounts"));
        const acc = accounts[index];
        document.getElementById("accFirstName").value = acc.firstName;
        document.getElementById("accLastName").value = acc.lastName;
        document.getElementById("accEmail").value = acc.email;
        document.getElementById("accRole").value = acc.role;
        document.getElementById("accVerified").checked = acc.verified;
        editAccIndex = index;
        accountFormContainer.style.display = "block";
    };

    window.deleteAccount = function(index) {
        if(confirm("Are you sure you want to delete this account?")) {
            let accounts = JSON.parse(localStorage.getItem("accounts"));
            accounts.splice(index, 1);
            localStorage.setItem("accounts", JSON.stringify(accounts));
            renderAccounts();
        }
    };

    window.resetPassword = function(index) {
        alert("Password reset link simulated for this account.");
    };

    if (accountForm) {
        accountForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
            const newAccount = {
                firstName: document.getElementById("accFirstName").value,
                lastName: document.getElementById("accLastName").value,
                email: document.getElementById("accEmail").value,
                password: document.getElementById("accPassword").value,
                role: document.getElementById("accRole").value,
                verified: document.getElementById("accVerified").checked
            };
            if (editAccIndex !== null) {
                accounts[editAccIndex] = newAccount;
                editAccIndex = null;
            } else {
                accounts.push(newAccount);
            }
            localStorage.setItem("accounts", JSON.stringify(accounts));
            renderAccounts();
            accountFormContainer.style.display = "none";
            accountForm.reset();
        });
    }

    // ================= DEPARTMENTS CRUD =================
    window.renderDepartments = function() {
        const depts = JSON.parse(localStorage.getItem("departments")) || [
            { name: "Engineering", desc: "Software team" },
            { name: "HR", desc: "Human Resources" }
        ];
        if (!deptTableBody) return;
        deptTableBody.innerHTML = "";
        depts.forEach((dept, index) => {
            deptTableBody.innerHTML += `
                <tr>
                    <td>${dept.name}</td>
                    <td>${dept.desc}</td>
                    <td>
                        <button onclick="editDept(${index})" class="btn-filled-edit">Edit</button>
                        <button onclick="deleteDept(${index})" class="btn-filled-delete">Delete</button>
                    </td>
                </tr>`;
        });
    }

    window.editDept = function(index) {
        const depts = JSON.parse(localStorage.getItem("departments"));
        document.getElementById("deptName").value = depts[index].name;
        document.getElementById("deptDesc").value = depts[index].desc;
        editDeptIndex = index;
        deptFormContainer.style.display = "block";
        document.getElementById("deptFormTitle").innerText = "Edit Department";
    };

    window.deleteDept = function(index) {
        if(confirm("Delete department?")){
            let depts = JSON.parse(localStorage.getItem("departments"));
            depts.splice(index, 1);
            localStorage.setItem("departments", JSON.stringify(depts));
            renderDepartments();
        }
    };

    if (deptForm) {
        deptForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let depts = JSON.parse(localStorage.getItem("departments")) || [];
            const data = { name: document.getElementById("deptName").value, desc: document.getElementById("deptDesc").value };
            if (editDeptIndex !== null) {
                depts[editDeptIndex] = data;
                editDeptIndex = null;
            } else {
                depts.push(data);
            }
            localStorage.setItem("departments", JSON.stringify(depts));
            renderDepartments();
            deptFormContainer.style.display = "none";
            deptForm.reset();
        });
    }

    // ================= EMPLOYEES CRUD =================
    window.renderEmployees = function() {
        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        if (!employeeTableBody) return;
        employeeTableBody.innerHTML = "";
        if (employees.length === 0) {
            employeeTableBody.innerHTML = '<tr><td colspan="5" class="empty-msg">No employees.</td></tr>';
            return;
        }
        employees.forEach((emp, index) => {
            employeeTableBody.innerHTML += `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.email ? emp.email.split('@')[0] : 'user'}</td> 
                    <td>${emp.position}</td>
                    <td>${emp.dept}</td>
                    <td>
                        <button onclick="editEmployee(${index})" class="btn-filled-edit">Edit</button>
                        <button onclick="deleteEmployee(${index})" class="btn-filled-delete">Delete</button>
                    </td>
                </tr>`;
        });
    }

    window.editEmployee = function(index) {
        const employees = JSON.parse(localStorage.getItem("employees"));
        const emp = employees[index];
        document.getElementById("empId").value = emp.id;
        document.getElementById("empEmail").value = emp.email;
        document.getElementById("empPosition").value = emp.position;
        document.getElementById("empDept").value = emp.dept;
        if(document.getElementById("empHireDate")) document.getElementById("empHireDate").value = emp.hireDate || "";
        editIndex = index; 
        employeeFormContainer.style.display = "block";
        document.querySelector("#employeeFormContainer h3").innerText = "Edit Employee";
    };

    window.deleteEmployee = function(index) {
        if(confirm("Delete employee?")){
            let employees = JSON.parse(localStorage.getItem("employees"));
            employees.splice(index, 1);
            localStorage.setItem("employees", JSON.stringify(employees));
            renderEmployees();
        }
    };

    if (employeeForm) {
        employeeForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let employees = JSON.parse(localStorage.getItem("employees")) || [];
            const empData = {
                id: document.getElementById("empId").value,
                email: document.getElementById("empEmail").value,
                position: document.getElementById("empPosition").value,
                dept: document.getElementById("empDept").value,
                hireDate: document.getElementById("empHireDate") ? document.getElementById("empHireDate").value : ""
            };
            if (editIndex !== null) {
                employees[editIndex] = empData;
                editIndex = null; 
            } else {
                employees.push(empData);
            }
            localStorage.setItem("employees", JSON.stringify(employees));
            renderEmployees();
            employeeFormContainer.style.display = "none";
            employeeForm.reset();
        });
    }

    // ================= REQUESTS LOGIC =================
    window.renderRequests = function() {
        const requests = JSON.parse(localStorage.getItem("myRequests")) || [];
        const tableBody = document.getElementById("requestTableBody");
        const noReqMsg = document.getElementById("noRequestsMsg");
        const reqTable = document.getElementById("requestTable");

        if (requests.length > 0) {
            noReqMsg.style.display = "none";
            reqTable.style.display = "table";
            tableBody.innerHTML = "";
            requests.forEach(req => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${req.type}</td>
                        <td>${req.items.length} items</td>
                        <td><span class="status-pending">Pending</span></td>
                    </tr>`;
            });
        } else {
            noReqMsg.style.display = "block";
            reqTable.style.display = "none";
        }
    }

    if (requestForm) {
        requestForm.onsubmit = function(e) {
            e.preventDefault();
            const rows = document.querySelectorAll(".item-row");
            const items = Array.from(rows).map(row => ({
                name: row.querySelectorAll("input")[0].value,
                qty: row.querySelectorAll("input")[1].value
            }));
            const newRequest = {
                type: document.getElementById("requestType").value,
                items: items,
                date: new Date().toLocaleDateString()
            };
            const requests = JSON.parse(localStorage.getItem("myRequests")) || [];
            requests.push(newRequest);
            localStorage.setItem("myRequests", JSON.stringify(requests));
            requestModal.style.display = "none";
            this.reset();
            renderRequests();
        };
    }

    if (itemsContainer) {
        itemsContainer.addEventListener("click", function(e) {
            if (e.target.classList.contains("add-item-btn")) {
                const newRow = document.createElement("div");
                newRow.className = "item-row";
                newRow.innerHTML = `
                    <input type="text" placeholder="Item name" required class="item-input-name">
                    <input type="number" value="1" min="1" class="item-input-qty">
                    <button type="button" class="remove-item-btn btn-remove-item">&times;</button>`;
                itemsContainer.appendChild(newRow);
            } else if (e.target.classList.contains("remove-item-btn")) {
                e.target.parentElement.remove();
            }
        });
    }

    // ================= NAVIGATION LOGIC =================
    function setupNavigationLinks() {
        document.querySelectorAll("a").forEach(link => {
            link.onclick = (e) => {
                const linkText = link.innerText.trim();
                
                if (linkText === "Employees" || link.classList.contains("nav-employees")) {
                    e.preventDefault(); showSection(employeesSection); renderEmployees();
                } else if (linkText === "Register" || link.id === "registerLink") {
                    e.preventDefault(); showSection(registerSection);
                } else if (linkText === "Profile" || link.classList.contains("nav-profile")) {
                    e.preventDefault(); showSection(adminSection);
                } else if (linkText === "Departments" || link.classList.contains("nav-departments")) {
                    e.preventDefault(); showSection(departmentsSection); renderDepartments();
                } else if (linkText === "Accounts" || link.classList.contains("nav-accounts") || link.classList.contains("nav-account")) {
                    e.preventDefault(); showSection(accountSection); renderAccounts();
                } else if (linkText === "My Requests" || link.classList.contains("nav-myrequest") || link.classList.contains("nav-myRequests")) {
                    e.preventDefault(); showSection(myRequestsSection); renderRequests();
                } else if (linkText === "Logout" || link.id === "logoutBtn" || link.classList.contains("logoutBtn")) {
                    e.preventDefault();
                    localStorage.removeItem("loggedIn");
                    if (mainNavbar) mainNavbar.style.display = "flex";
                    showSection(homeSection);
                }
            };
        });
    }

    setupNavigationLinks();

    // UI Trigger buttons
    if (document.getElementById("loginLink")) document.getElementById("loginLink").onclick = () => showSection(loginSection);
    if (document.getElementById("getStartedBtn")) document.getElementById("getStartedBtn").onclick = () => showSection(loginSection);
    if (document.getElementById("backBtn")) document.getElementById("backBtn").onclick = () => showSection(homeSection);
    
    // Employee buttons
    if (document.getElementById("addEmployeeBtn")) {
        document.getElementById("addEmployeeBtn").onclick = () => {
            editIndex = null; employeeForm.reset();
            document.querySelector("#employeeFormContainer h3").innerText = "Add Employee";
            employeeFormContainer.style.display = "block";
        };
    }
    if (document.getElementById("cancelEmpBtn")) document.getElementById("cancelEmpBtn").onclick = () => employeeFormContainer.style.display = "none";

    // Dept buttons
    if (document.getElementById("addDeptBtn")) {
        document.getElementById("addDeptBtn").onclick = () => {
            editDeptIndex = null; deptForm.reset();
            document.getElementById("deptFormTitle").innerText = "Add Department";
            deptFormContainer.style.display = "block";
        };
    }
    if (document.getElementById("cancelDeptBtn")) document.getElementById("cancelDeptBtn").onclick = () => deptFormContainer.style.display = "none";

    // Account buttons
    if (document.getElementById("addAccountBtn")) {
        document.getElementById("addAccountBtn").onclick = () => {
            editAccIndex = null; accountForm.reset();
            accountFormContainer.style.display = "block";
        };
    }
    if (document.getElementById("cancelAccBtn")) document.getElementById("cancelAccBtn").onclick = () => accountFormContainer.style.display = "none";

    // Request buttons
    const openReq = () => { requestModal.style.display = "block"; };
    if (document.getElementById("openRequestModalBtn")) document.getElementById("openRequestModalBtn").onclick = openReq;
    if (document.getElementById("createFirstBtn")) document.getElementById("createFirstBtn").onclick = openReq;
    if (document.getElementById("closeModal")) document.getElementById("closeModal").onclick = () => requestModal.style.display = "none";

    // ================= INITIALIZATION =================
    if (localStorage.getItem("loggedIn") === "true") {
        if (mainNavbar) mainNavbar.style.display = "none";
        showSection(adminSection);
    } else {
        showSection(homeSection);
    }
});

// Dropdown Toggle
window.onclick = function(event) {
    if (event.target.matches('.dropbtn')) {
        const dropdownContent = event.target.nextElementSibling;
        if (dropdownContent) dropdownContent.classList.toggle("show");
    } else {
        document.querySelectorAll(".dropdown-content").forEach(d => d.classList.remove("show"));
    }
};