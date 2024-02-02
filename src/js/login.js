let elform = document.querySelector("#form");
let elUser = document.querySelector("#username");
let elPass = document.querySelector("#password");
let url = "http://localhost:7777";
let token = localStorage.getItem("token");
elform.addEventListener("submit", async (e) => {
  e.preventDefault();
  let res = await fetch(url + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: elUser.value,
      password: elPass.value,
    }),
  });
  if (res.ok) {
    let data = await res.json();
    localStorage.setItem("token", data.token);
    location.pathname = "src/index.html";
  } else if ((res.status = 401)) {
    alert("you did not sign up!");
    location.pathname = "src/signup.html";
  }
});
