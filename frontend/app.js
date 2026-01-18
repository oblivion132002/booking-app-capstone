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

      alert("Login successful!");

      const userIdInput = document.getElementById("user-id");
      userIdInput.value = loggedInUserId;
      userIdInput.disabled = true;

      document.getElementById("login-warning").style.display = "none";
      document.getElementById("service-id").disabled = false;
      document.getElementById("date").disabled = false;
      document.getElementById("time").disabled = false;
      document.getElementById("book-btn").disabled = false;
    });
}

fetch(`${API}/services`)
  .then(res => res.json())
  .then(services => {
    const container = document.getElementById("services");
    container.innerHTML = "";

    services.forEach(s => {
      const div = document.createElement("div");
      div.className = "service-card";

      let descriptionText = "";

      if (s.service_id === 1) {
        descriptionText =
          "Portrait Photography — a relaxed session focused on capturing your personality, style, and expression.";
      } else if (s.service_id === 2) {
        descriptionText =
          "Event Photography — professional coverage capturing candid moments and key highlights of your event.";
      } else if (s.service_id === 3) {
        descriptionText =
          "Wedding Photography — full-day coverage documenting emotions, details, and unforgettable moments.";
      } else {
        descriptionText =
          "Professional photography session tailored to your needs.";
      }


      div.innerHTML = `
        <h4>${s.service_name}</h4>
        <p>${descriptionText}</p>
        <p><strong>$${s.price}</strong></p>
      `;

      div.onclick = () => {
        document.getElementById("service-id").value = s.service_id;
      };

      container.appendChild(div);
    });
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
