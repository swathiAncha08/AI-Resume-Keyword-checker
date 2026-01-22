async function checkResume() {
  const role = document.getElementById("role").value;
  const fileInput = document.getElementById("resume");

  if (!fileInput.files.length) {
    alert("Please upload a resume PDF first.");
    return;
  }

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("role", role);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    document.getElementById("result").innerHTML = `
      <b>Score:</b> ${data.score}%<br><br>
      <b>Matched:</b> ${data.matched.join(", ")}<br><br>
      <b>Missing:</b> ${data.missing.join(", ")}
    `;
  } catch (err) {
    alert("Server error. Check Node terminal.");
    console.error(err);
  }
}
