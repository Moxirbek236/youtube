const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("accesToken")
  }
});

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();  
    try {
        const response = await axios.post("http://localhost:8000/login", {
            "full_name": usernameInput.value,
            "password": passwordInput.value,
        });
        console.log(response.data.data.accessToken);
        localStorage.setItem("accesToken", response.data.data.accessToken);
        localStorage.setItem("avatar_url", response.data.data.avatar_url);
        alert("Login successful!");
        window.location.href = "/";
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
    }
});