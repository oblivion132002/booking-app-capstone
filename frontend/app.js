const API = "http://localhost:3000";
let loggedInUserId = null;

function register() {
  fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("reg-name").value,
      email: document.getElementById("reg-email").value,
      password: document.getElementById("reg-password").value
    })
  })
    .then(res => res.json())
    .then(() => alert("Registration successful! You can now log in."));
}

function login() {
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("login-email").value,
      password: document.getElementById("login-password").value
    })
  })
    .then(res => res.json())
    .then(data => {
      loggedInUserId = data.user_id;

      document.getElementById("user-id").value = loggedInUserId;
      document.getElementById("service-id").disabled = false;
      document.getElementById("date").disabled = false;
      document.getElementById("time").disabled = false;
      document.getElementById("book-btn").disabled = false;
      document.getElementById("login-warning").style.display = "none";

      alert("Login successful!");
    });
}

/* ===== LOAD PHOTOGRAPHY PACKAGES ===== */

fetch(`${API}/services`)
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }
    return res.json();
  })
  .then(services => {
    const container = document.getElementById("services");
    container.innerHTML = "";

    if (!services || services.length === 0) {
      container.innerHTML = "<p>No packages available.</p>";
      return;
    }

    services.forEach(service => {
      const card = document.createElement("div");
      card.className = "service-card";

      let description = "";

      if (service.service_id === 1) {
        description =
          "Portrait Photography — a relaxed session capturing personality, style, and expression.";
      } else if (service.service_id === 2) {
        description =
          "Event Photography — professional coverage capturing key highlights and candid moments.";
      } else if (service.service_id === 3) {
        description =
          "Wedding Photography — full-day coverage of your most important moments.";
      } else {
        description =
          "Professional photography session tailored to your needs.";
      }

      card.innerHTML = `
        <h4>${service.service_name}</h4>
        <p>${description}</p>
        <p><strong>$${service.price}</strong></p>
      `;

      card.onclick = () => {
        document.getElementById("service-id").value = service.service_id;
      };

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("services").innerHTML =
      "<p style='color:white'>Unable to load packages.</p>";
  });

function book() {
  fetch(`${API}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: loggedInUserId,
      service_id: document.getElementById("service-id").value,
      appointment_date: document.getElementById("date").value,
      appointment_time: document.getElementById("time").value
    })
  })
    .then(res => res.json())
    .then(() => alert("Photoshoot booked successfully!"));
}
