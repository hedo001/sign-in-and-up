let elform = document.querySelector("#form");
let elUser = document.querySelector("#username");
let elPass = document.querySelector("#password");
let url = "http://localhost:7777";
let token = localStorage.getItem("token");
elform.addEventListener("submit", async (e) => {
  e.preventDefault();
  let res = await fetch(url + "/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: elUser.value,
      password: elPass.value,
    }),
  });
  let data = await res.json();
  localStorage.setItem("token", data.token);
  if (res.ok) {
    location.pathname = "src/index.html";
  } else if (res.status == 409) {
    alert("you already signed up!Go to login");
    location.pathname = "src/login.html";
  }
});
