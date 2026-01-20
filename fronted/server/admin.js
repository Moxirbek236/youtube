const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("accesToken")
  }
});

let editInput = document.querySelector(".content");

const userVideos = async () => {
  try {
    videosList.innerHTML = ``;
    const accesToken = window.localStorage.getItem("accesToken");
    const oneUserVideos = await axios.get(
      "http://localhost:8000/video/oneUser",
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );

    const videos = oneUserVideos.data.data;
    for (const video of videos) {
      videosList.innerHTML += `
      <li class="video-item" data-id="${video.id}">
        <video controls="true" src="http://localhost:8000/uploads/${video.avatar_url}" width="300px" height="200px" style="display:block"></video>
        <p class="content" contenteditable="true">${video.title}</p>
        <div class="buttons">
        <button class="deletedVideoBtn" style="margin-left:10px">
        <button class="deleteVideoBtn" style="position: absolute; top: 12.5px; right: 12.5px; display: none; cursor: pointer;">
        </div>
        <img id="deleteIcon" src="http://localhost:8000/uploads/delete.png" width="25">
        <img id="editIcon" src="http://localhost:8000/uploads/edit.png" width="25" style="display: flex; position: absolute; left: 20px;">
        </button>
        </li>
        `;
    }
  } catch (error) {
    if (error.response.status == 401) {
      window.localStorage.removeItem("accesToken");
      window.localStorage.removeItem("avatar_url");
      window.location = "/login";
    }
    console.log("ERROR" + error);
  }
};
userVideos();

videosList.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "deleteIcon") {
    const videoItem = e.target.closest(".video-item");
    const videoId = videoItem.getAttribute("data-id");

    try {
      const accessToken = window.localStorage.getItem("accesToken");
      await axios.delete(`http://localhost:8000/video/${videoId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Video deleted successfully!");
      userVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video. Please try again.");
    }
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("accesToken");
  localStorage.removeItem("avatar_url");
  window.location.href = "/login";
});

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const accessToken = window.localStorage.getItem("accesToken");
  let formData = new FormData();
  formData.append("title", videoInput.value);
  formData.append("file", uploadInput.files[0]);
  try {
    const response = await axios.post("http://localhost:8000/video", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data.data);
    alert("Video upload successful!");
    userVideos();
  } catch (error) {
    console.error("Error uploading video:", error);
    alert("Video upload failed. Please try again.");
  }
});


// const content = document.querySelector(".content");
let accesToken = window.localStorage.getItem("accesToken");

document.addEventListener("keydown", async (e) => {
  if (e.target.classList.contains("content") && e.key === "Enter") {
    e.preventDefault();
    let text = e.target.textContent.trim()
    await axios.put(`http://localhost:8000/video/${e.target.parentElement.getAttribute("data-id")}`,{title:text},{
      headers: {
        "Authorization": `Bearer ${accesToken}`,
      },
    });
  }
});
