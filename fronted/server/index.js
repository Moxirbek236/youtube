const navbarList = document.querySelector(".navbar-list");
const iframesList = document.querySelector(".iframes-list");
const userAvatar = document.querySelector(".avatar-img");
const searchButton = document.querySelector(".search-btn");
const inputSearch = document.querySelector(".search-input");

let users, videos;
let token = localStorage.getItem("accesToken");
let userAvatarUrl = localStorage.getItem("avatar_url");

if (token) {
  userAvatar.src = "http://localhost:8000/uploads/" + userAvatarUrl;
  list.href = "/admin";
}

(async () => {
  try {
    let usersRes = await axios.get("http://localhost:8000/users");
    let videosRes = await axios.get(`http://localhost:8000/files`);

    users = usersRes.data.data;
    videos = videosRes.data.data;

    getUsers(), getAllVideos();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

const temp = async (video, user) => {
  const res = await axios.get(
    `http://localhost:8000/download/${video.avatar_url}`,
    { responseType: "blob" }
  );
  let size = res.data.size;
  size = (size / (1024 * 1024)).toFixed(2) + " MB";

  const creat_year = new Date(video.created_at).getFullYear();
  const creat_month = new Date(video.created_at).getMonth() + 1;
  const creat_day = new Date(video.created_at).getDate();
  const creat_time = new Date(video.created_at).toTimeString().slice(0, 5);

  return `
    <li class="iframe">
        <video src="http://localhost:8000/uploads/${video.avatar_url}" controls=""></video>
        <div class="iframe-footer">
            <img src="http://localhost:8000/uploads/${user.avatar_url}" alt="channel-icon">
            <div class="iframe-footer-text">
                <h2 class="channel-name">${user.full_name}</h2>
                <h3 class="iframe-title">${video.title}</h3>
                <time class="uploaded-time">${creat_year}/${creat_month}/${creat_day} | ${creat_time}</time>
                <a class="download" href="http://localhost:8000/download/${video.avatar_url}" download>
                    <span>${size}</span>
                    <img src="./img/download.png">
                </a>
            </div>                  
        </div>
    </li>           
  `;
};

const getUsers = async () => {
  try {
    for (const user of users) {
      navbarList.innerHTML += `
            <li class="channel" onclick="getUserByClick(${user.id})" data-id="${user.id}">
                <a href="#">
                    <img src="http://localhost:8000/uploads/${user.avatar_url}" alt="channel-icon" width="30px" height="30px">
                    <span>${user.full_name}</span>
                </a>
            </li>
            `;
    }
  } catch (error) {
    console.error("Error users:", error);
  }
};

const voice = async () => {
  const SpeechRecognition = window.SpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "uz-UZ";
  recognition.start();

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    inputSearch.value = text;
    getAllVideos(text);
    searchUsers(text);
  };
};

const searchUsers = async (search) => {
  let users = await axios.get(`http://localhost:8000/search?search=${search}`);
  users = users.data.users[0];
  iframesList.innerHTML += `
    <li class="userIframe" id="userIframe" onclick="getUserByClick(${users.id})"><br><br>
      <img src="http://localhost:8000/uploads/${users.avatar_url}" width="100px" height="100px"><br><br><br>
      <h1>${users.full_name}</h1>
    </li>
    `;
};

const getAllVideos = async (search) => {
  videos = await axios.get(
    `http://localhost:8000/files${search ? "?search=" + search : ""}`
  );
  videos = videos.data.data;
  try {
    let html = ``;
    for (let i = 0; i < videos.length; i++) {
      let video = videos[i];
      const user = users.find((u) => u.id === video.user_id);
      html += await temp(video, user);
    }
    iframesList.innerHTML = html;
  } catch (error) {
    console.log("Error videos:", error);
  }
};

const getUserByClick = async (id) => {
  try {
    iframesList.innerHTML = ``;
    if (!id) return massageRender();

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const user = users.find((u) => u.id === id);

      if (video.user_id === user.id)
        iframesList.innerHTML += await temp(video, user);
    }
  } catch (error) {
    console.log("Error userById:", error);
  }
};

const massageRender = async () => await getAllVideos();
searchButton.addEventListener("click", async (e) => {
  if (!inputSearch.value) {
    getAllVideos();
  } else {
    getAllVideos(inputSearch.value);
    searchUsers(inputSearch.value);
  }
});
