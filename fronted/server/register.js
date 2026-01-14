submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

    let formData = new FormData();
    formData.append("full_name", usernameInput.value);
    formData.append("password", passwordInput.value);
    formData.append("file", uploadInput.files[0]);
    try {
      const response = await axios.post("http://localhost:8000/registry",formData);
      console.log(response.data.data);
      
        window.localStorage.setItem("accesToken", response.data.data.accessToken);
        window.localStorage.setItem("avatar_url", response.data.data.avatar_url);
        alert("register successful!");
        window.location.href = "/";
    } catch (error) {
      console.error("Error registr:", error);
      alert("registery failed. Please try again.");
    }
});