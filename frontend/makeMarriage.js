async function createMarriage() {
  const spouse1Address = document.getElementById("spouse1Address").value.trim();
  const spouse2Address = document.getElementById("spouse2Address").value.trim();

  if (!spouse1Address || !spouse2Address) {
    document.getElementById("errorMessage").innerText =
      "Both addresses are required!";
    return;
  }

  document.getElementById("errorMessage").innerText = "";
  document.getElementById("loadingMessage").classList.remove("hidden");
  document.getElementById("submitButton").innerText = "Processing...";
  document.getElementById("submitButton").disabled = true;

  try {
    const response = await fetch("http://localhost:3000/makemarriage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spouse1: spouse1Address,
        spouse2: spouse2Address,
      }),
    });

    const result = await response.json();
    throw new Error(result.message || "An unknown error occurred.");
  } catch (error) {
    document.getElementById("errorMessage").innerText =
      error.message || "Error creating marriage contract. Please try again.";
    console.error(error);
  } finally {
    document.getElementById("loadingMessage").classList.add("hidden");
    alert("Marriage contract created successfully!");
    document.getElementById("submitButton").innerText = "Create Contract";
    document.getElementById("submitButton").disabled = false;
  }
}
