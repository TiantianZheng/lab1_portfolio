console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}


// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add("current");
// Step 3.1 + Step 3.2: Automatic navigation menu with highlights

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/lab1_portfolio/"; // 

let pages = [
  { url: "", title: "Home" },
  { url: "Projects/", title: "Projects" },
  { url: "Contact/", title: "Contact" },
  { url: "CV/", title: "Resume" },
  { url: "https://github.com/tiantianzheng", title: "GitHub" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;


 
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );


  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

const select = document.querySelector(".color-scheme select");

function setColorScheme(scheme) {
document.documentElement.style.setProperty("color-scheme", scheme);
}

select.addEventListener("input", (event) => {
const scheme = event.target.value;
setColorScheme(scheme);
localStorage.colorScheme = scheme;
});

if ("colorScheme" in localStorage) {
    const saved = localStorage.colorScheme;
    setColorScheme(saved);
    select.value = saved;
  }