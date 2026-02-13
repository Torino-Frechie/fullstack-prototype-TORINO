const homeSection = document.getElementById("homeSection");
const registerSection = document.getElementById("registerSection");
const verifySection = document.getElementById("verifySection");
const loginSection = document.getElementById("loginSection");

const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");
const getStartedBtn = document.getElementById("getStartedBtn");
const backBtn = document.getElementById("backBtn");

const simulateBtn = document.getElementById("simulateBtn");
const goLoginBtn = document.getElementById("goLoginBtn");
const cancelLoginBtn = document.getElementById("cancelLoginBtn");

const registerForm = document.querySelector("form");
const loginForm = document.getElementById("loginForm");

const userEmailSpan = document.getElementById("userEmail");
const verifiedMessage = document.getElementById("verifiedMessage");


// SHOW REGISTER
registerLink.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(registerSection);
});

getStartedBtn.addEventListener("click", function () {
    showSection(registerSection);
});

backBtn.addEventListener("click", function () {
    showSection(homeSection);
});


// REGISTER SUBMIT
registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = registerForm.querySelector("input[type='email']").value;
    userEmailSpan.textContent = email;

    showSection(verifySection);
});


// SIMULATE EMAIL VERIFY
simulateBtn.addEventListener("click", function () {
    showSection(loginSection);
    verifiedMessage.style.display = "block";
});


// GO TO LOGIN BUTTON
goLoginBtn.addEventListener("click", function () {
    showSection(loginSection);
});


// LOGIN LINK FROM NAV
loginLink.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(loginSection);
});


// CANCEL LOGIN
cancelLoginBtn.addEventListener("click", function () {
    showSection(homeSection);
});


// LOGIN SUBMIT
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Login successful! 🎉 (Simulation)");
    showSection(homeSection);
});


// HELPER FUNCTION
function showSection(sectionToShow) {
    homeSection.style.display = "none";
    registerSection.style.display = "none";
    verifySection.style.display = "none";
    loginSection.style.display = "none";

    sectionToShow.style.display = "block";
}
