const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("accesToken"),
  },
});

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

    getUsers(),
    getAllVideos()
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

const temp = async (video, user) => {
  const res = await axios.get(
    `http://localhost:8000/download/${video.avatar_url}`,
    { responseType: "blob" },
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
  <li class="channel"
      onclick="getUserByClick(${user.id}, '${user.full_name}', '${user.avatar_url}')"
      data-id="${user.id}">
    <a href="#">
      <img src="http://localhost:8000/uploads/${user.avatar_url}" alt="channel-icon" width="30" height="30">
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
  users = users.data.users
  for (let i = 0; i <= users.length-1; i++) {        
    iframesList.innerHTML += `
      <li class="userIframe" id="userIframe" onclick="getUserByClick(${users[i].id})"><br><br>
        <img src="http://localhost:8000/uploads/${users[i].avatar_url}" width="100px" height="100px"><br><br><br>
        <h1>${users[i].full_name}</h1>
      </li>
      `;
  }
};

const getAllVideos = async (search) => {
  videos = await axios.get(
    `http://localhost:8000/files${search ? "?search=" + search : ""}`,
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

const getUserByClick = async (id, name, avatar_url) => {
  try {
    iframesList.innerHTML = ``;
    if (!id) return massageRender();
    id = Number(id);

    const messages = await axios.get(`http://localhost:8000/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = users.find((u) => u.id === id);

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];

      if (video.user_id === user.id) {
        iframesList.innerHTML += await temp(video, user);
      }

      onlyChat(id, user, messages, avatar_url, name);
    }
  } catch (error) {
    console.log("Error userById:", error);
  }
};

const onlyChat = async (id, user, messages, avatar_url, name) => {
  let msges = messages.data.data;
  chatBody.innerHTML = ``;
  for (const msg of msges) {
    if (msg.user_id_from === user.id) {
      chatBody.innerHTML += `
          <div class="message other">
            ${msg.message}
          </div>
        `;
    } else {
      chatBody.innerHTML += `
          <div class="message me">
            ${msg.message}
          </div>
        `;
    }
  }

  chatUserAvatar.src = "http://localhost:8000/uploads/" + avatar_url;
  chatUserName.textContent = name;

  sendBtn.addEventListener("click", async () => {
    if (!id) return;

    const message = chatInput.value.trim();
    if (!message) return;

    chatInput.value = "";

    let res = await axios.post(
      `http://localhost:8000/message/${id}`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.status === 200 || res.status === 201) {
      if (res.data.data.user_id_to === user.id) {
        chatBody.innerHTML += `
          <div class="message me">
          ${message}
          </div>
          `;
      }
      return;
    }

    socket.on("send_message", (data) => {
      console.log(data);
      if (data.user_id_to === user.id) {
        chatBody.innerHTML += `
          <div class="message other">
          ${data.message}
          </div>
          `;
      }
      return;
    });
  });
};

const massageRender = async () => await getAllVideos();
searchButton.addEventListener("click", async (e) => {
  if (!inputSearch.value) {
    getAllVideos();
  } else {
    searchUsers(inputSearch.value);
    getAllVideos(inputSearch.value);
  }
});

socket.on("error", (error) => {
  alert(error.message);
});

socket.on("send_message", (data) => {
  chatBody.innerHTML += `
          <div class="message other">
          ${data}
          </div>
          `;
});
