// ===================== Register =====================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message || data.error);
      if (res.ok) window.location.href = "login.html";
    } catch (err) {
      alert("Registration failed. Try again.");
    }
  });
}

// ===================== Login =====================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Login failed. Try again.");
    }
  });
}

// ===================== Dashboard Summary =====================
if (window.location.pathname.includes("dashboard.html")) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
  } else {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const isAdmin = decodedToken.role === "admin";

    const adminDiv = document.getElementById("adminButtons");
    if (isAdmin && adminDiv) {
      adminDiv.style.display = "block";
    }

    fetch("http://localhost:5000/api/summary", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        document.getElementById("donations").textContent = data.totalDonations;
        document.getElementById("expenses").textContent = data.totalExpenses;
        document.getElementById("balance").textContent = data.remainingBalance;
      })
      .catch(() => {
        alert("Failed to load summary");
      });
  }
}

// ===================== Add Donation =====================
const donationForm = document.getElementById("donationForm");
if (donationForm) {
  donationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const donor = document.getElementById("donor").value;
    const amount = document.getElementById("amount").value;
    const purpose = document.getElementById("purpose").value;
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/donation/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ donor, amount, purpose }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) donationForm.reset();
  });
}

// ===================== Add Expense =====================
const expenseForm = document.getElementById("expenseForm");
if (expenseForm) {
  expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = document.getElementById("item").value;
    const cost = document.getElementById("cost").value;
    const reason = document.getElementById("reason").value;
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/expense/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ item, cost, reason }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) expenseForm.reset();
  });
}

// ===================== Add Event =====================
// ===================== Add Event =====================
const eventForm = document.getElementById("eventForm");
if (eventForm) {
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const description = document.getElementById("description").value;

    if (!date || !time) {
      alert("Please enter both date and time.");
      return;
    }

    // ✅ Send date and time as separate fields
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/event/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title,
        date,      // ✅ sent as string e.g. "2025-09-10"
        time,      // ✅ sent as string e.g. "19:00"
        description
      }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) {
      eventForm.reset();
      loadEvents();
    }
  });
}


// ===================== View Events =====================
async function loadEvents() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/event/all", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const events = await res.json();
    const eventList = document.getElementById("eventList");
    if (!eventList) return;

    eventList.innerHTML = "";

    events.forEach((event) => {
      const li = document.createElement("li");
      const date = new Date(event.datetime);
      const formatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
      li.textContent = `${event.title} - ${formatted} (${event.description || "No description"})`;
      eventList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load events:", err);
    alert("Could not fetch events.");
  }
}

// ===================== Show Event Form for Admin Only =====================
if (window.location.pathname.includes("event.html")) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
  } else {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const isAdmin = decoded.role === "admin";

    const adminSection = document.getElementById("adminControls");
    if (adminSection && isAdmin) {
      adminSection.style.display = "block";
    }
  }
}

// ===================== Auto load Events =====================
if (document.getElementById("eventList")) {
  loadEvents();
}

// ===================== Logout =====================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
