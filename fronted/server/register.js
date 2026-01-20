const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("accesToken")
  }
});


submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  let formData = new FormData();
  formData.append("full_name", usernameInput.value);
  formData.append("password", passwordInput.value);
  formData.append("email", email.value);
  formData.append("otp", otpInput.value);
  formData.append("file", uploadInput.files[0]);
  try {
    const response = await axios.post(
      "http://localhost:8000/registry",
      formData
    );

    window.localStorage.setItem("accesToken", response.data.data.accessToken);
    window.localStorage.setItem("avatar_url", response.data.data.avatar_url);
    alert("register successful!");
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
});
const createModal = () => {
  // overlay
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  });

  // modal box
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  });

  // title
  const title = document.createElement("h3");
  title.innerText = "Emailni kiriting";

  // input
  const input = document.createElement("input");
  input.type = "email";
  input.placeholder = "example@mail.com";
  Object.assign(input.style, {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  });

  // submit button
  const submitBtn = document.createElement("button");
  submitBtn.innerText = "Tasdiqlash";
  Object.assign(submitBtn.style, {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  });

  // close button
  const closeBtn = document.createElement("span");
  closeBtn.innerText = "❌";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "10px",
    right: "20px",
    cursor: "pointer",
    fontSize: "18px",
  });

  closeBtn.onclick = () => document.body.removeChild(overlay);

  // tasdiqlash funksiyasi
  submitBtn.onclick = async () => {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Iltimos, to‘g‘ri email kiriting!");
      return;
    }

    try {
      // POST so'rov yuborish
      const response = await fetch("http://localhost:8000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // emailni body orqali jo'natamiz
      });

      if (!response.ok) throw new Error("Server xatolik berdi");

      const data = await response.json();
      alert("Email muvaffaqiyatli yuborildi: " + email);
      document.body.removeChild(overlay);
    } catch (err) {
      console.error(err);
      alert("Email yuborilmadi! Iltimos, keyinroq urinib ko‘ring.");
    }
  };

  // elementlarni birlashtirish
  modal.appendChild(closeBtn);
  modal.appendChild(title);
  modal.appendChild(input);
  modal.appendChild(submitBtn);
  overlay.appendChild(modal);

  document.body.appendChild(overlay);
};

// 2. Button click bilan modalni ochish
document.getElementById("openModal").addEventListener("click", createModal);

