// TODO: change url

"use server";
export async function sendPostRequest(data: string) {
  const url = "http://127.0.0.1:5000/api";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command: data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Local Action Success:", result);
  } catch (error) {
    console.error("Local Action Error:", error);
  }
}
