console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"               // local development
    : "/lab1_portfolio/"; 

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add("current");
let pages = [
    { url: "", title: "Home" },
    { url: "Projects/", title: "Projects" },
    { url: "Contact/", title: "Contact" },
    { url: "CV/", title: "Resume" },
    { url: "https://github.com/tiantianzheng", title: "GitHub" },
  ];
let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith("http") ? BASE_PATH + url : url;
    
    // Create the link element
    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
        );
    if (a.host !== location.host) {
        a.target = "_blank";
    }
    // Add link to nav
    nav.append(a);
    }