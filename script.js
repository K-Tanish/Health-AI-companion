let currentStep = 1;

document.getElementById("next-btn").addEventListener("click", handleNext);
document
  .getElementById("previous-btn")
  .addEventListener("click", handlePrevious);
document.getElementById("confirm-btn").addEventListener("click", handleConfirm);

// Show/Hide dynamic fields based on user input
document
  .getElementById("health-issues")
  .addEventListener("change", function () {
    document.getElementById("health-details").style.display =
      this.value === "yes" ? "block" : "none";
  });

document.getElementById("diet").addEventListener("change", function () {
  document.getElementById("diet-details").style.display =
    this.value === "yes" ? "block" : "none";
});

document.getElementById("exercise").addEventListener("change", function () {
  document.getElementById("exercise-details").style.display =
    this.value === "yes" ? "block" : "none";
});

function handleNext() {
  if (currentStep === 1) {
    const username = document.getElementById("username").value;
    fetch("/validate-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Username already exists!");
        showStep(2);
      })
      .catch((err) => alert(err.message));
  } else if (currentStep === 2) {
    const details = `
      <p>Email: ${document.getElementById("email").value}</p>
      <p>Username: ${document.getElementById("username").value}</p>
      <p>Phone: ${document.getElementById("phone").value}</p>
      <p>Weight: ${document.getElementById("weight").value} kg</p>
      <p>Height: ${document.getElementById("height").value} cm</p>
      <p>Health Issues: ${
        document.getElementById("health-issues").value === "yes"
          ? document.getElementById("health-details").value
          : "None"
      }</p>
      <p>Follow Diet: ${
        document.getElementById("diet").value === "yes"
          ? document.getElementById("diet-details").value
          : "No"
      }</p>
      <p>Food Preference: ${
        document.getElementById("food-preference").value
      }</p>
      <p>Exercise Regularly: ${
        document.getElementById("exercise").value === "yes"
          ? document.getElementById("exercise-details").value
          : "No"
      }</p>
      <p>Music App: ${document.getElementById("music-app").value}</p>
      <p>Coach Preference: ${
        document.getElementById("coach-preference").value
      }</p>
    `;
    document.getElementById("confirmation-details").innerHTML = details;
    showStep(3);
  }
}

function handlePrevious() {
  showStep(currentStep - 1);
}

function handleConfirm() {
  const formData = {
    email: document.getElementById("email").value,
    username: document.getElementById("username").value,
    phone: document.getElementById("phone").value,
    weight: document.getElementById("weight").value,
    height: document.getElementById("height").value,
    health_issues: document.getElementById("health-issues").value,
    health_details: document.getElementById("health-details").value,
    diet: document.getElementById("diet").value,
    diet_details: document.getElementById("diet-details").value,
    food_preference: document.getElementById("food-preference").value,
    exercise: document.getElementById("exercise").value,
    exercise_details: document.getElementById("exercise-details").value,
    music_app: document.getElementById("music-app").value,
    coach_preference: document.getElementById("coach-preference").value,
  };

  fetch("/save-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }).then((res) => {
    if (res.ok) {
      document.getElementById("congratulations-popup").style.display = "flex";
      updateCongratulationsPage(formData);
    }
  });
}

function showStep(step) {
  document.querySelector(`.step.active`).classList.remove("active");
  currentStep = step;
  document.getElementById(`step-${currentStep}`).classList.add("active");

  document.getElementById("previous-btn").disabled = currentStep === 1;
  document.getElementById("next-btn").disabled = currentStep === 3;
}

function updateCongratulationsPage(formData) {
  const summary = `
    <p>Email: ${formData.email}</p>
    <p>Username: ${formData.username}</p>
    <p>Phone: ${formData.phone}</p>
    <p>Weight: ${formData.weight} kg</p>
    <p>Height: ${formData.height} cm</p>
    <p>Health Issues: ${
      formData.health_issues === "yes" ? formData.health_details : "None"
    }</p>
    <p>Follow Diet: ${
      formData.diet === "yes" ? formData.diet_details : "No"
    }</p>
    <p>Food Preference: ${formData.food_preference}</p>
    <p>Exercise Regularly: ${
      formData.exercise === "yes" ? formData.exercise_details : "No"
    }</p>
    <p>Music App: ${formData.music_app}</p>
    <p>Coach Preference: ${formData.coach_preference}</p>
  `;
  document.getElementById("confirmation-details").innerHTML = summary;
}
