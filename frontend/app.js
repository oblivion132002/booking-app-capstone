const API = 'http://localhost:3000';

async function register() {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: document.getElementById('reg-name').value,
      email: document.getElementById('reg-email').value,
      password: document.getElementById('reg-password').value
    })
  });
  alert(await res.text());
}

async function login() {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value
    })
  });
  const data = await res.json();
  alert(data.message);
}

async function loadServices() {
  const res = await fetch(`${API}/services`);
  const services = await res.json();
  const ul = document.getElementById('services');
  ul.innerHTML = '';
  services.forEach(s => {
    ul.innerHTML += `<li>${s.service_id} - ${s.service_name} ($${s.price})</li>`;
  });
}

async function book() {
  const res = await fetch(`${API}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: document.getElementById('user-id').value,
      service_id: document.getElementById('service-id').value,
      appointment_date: document.getElementById('date').value,
      appointment_time: document.getElementById('time').value
    })
  });
  alert(await res.text());
}

loadServices();
