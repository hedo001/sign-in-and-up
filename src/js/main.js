// Gazini bosila)
let token = localStorage.getItem("token");
let list = document.querySelector("ol");
let elForm = document.querySelector("form");
let elUser = document.querySelector("#user");
let elPass = document.querySelector("#password");
let logout = document.querySelector(".logout-btn");
let url = "http://localhost:7777";
async function GetData() {
  list.innerHTML = "";
  let res = await fetch(url + "/users", {
    headers: {
      Authorization: token,
    },
  });
  let data = await res.json();
  data.users.forEach((el) => {
    let item = document.createElement("li");
    item.textContent = `ID : ${JSON.stringify(
      el.id
    )}, Username: ${JSON.stringify(el.username)}`;
    list.appendChild(item);
  });
}
elForm.addEventListener("submit", async (e) => {
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

  GetData();
});
GetData();
logout.addEventListener("click", (e) => {
  localStorage.removeItem("token");
  location.reload();
});
if (!token) {
  location.pathname = "src/login.html";
}
