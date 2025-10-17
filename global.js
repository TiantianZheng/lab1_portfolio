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
    : "/lab1_portfolio/"; // ⚠️ 如果你的 GitHub repo 叫别的名字，请改成相应路径

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

  // ✅ 1. 调整相对路径
  url = !url.startsWith("http") ? BASE_PATH + url : url;

  // ✅ 2. 创建 <a> 元素
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // ✅ 3. 自动高亮当前页面
  // 方法1（简单写法）：
  // if (a.host === location.host && a.pathname === location.pathname) {
  //   a.classList.add("current");
  // }

  // 方法2（更简洁的 toggle 版本）：
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // ✅ 4. 外部链接在新标签页打开
  // 条件：外部链接的 host 与当前页面不同
  if (a.host !== location.host) {
    a.target = "_blank";
  }

  // ✅ 5. 把链接加入 <nav>
  nav.append(a);
}