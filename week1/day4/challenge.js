// A fake API that randomly fails, to simulate an unreliable network
function flakyApi(failRate = 0.5) {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 1000) + 200; // 200–1200ms

    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error("Network error: request failed"));
      } else {
        resolve({ id: 1, name: "Bharath", status: "ok" });
      }
    }, delay);
  });
}

// Small helper so we can wait between retries
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry the API call, waiting longer after each failure (exponential backoff)
async function fetchWithRetry(retries = 3, baseDelay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}...`);
      const data = await flakyApi();
      console.log("Success:", data);
      return data;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      if (attempt === retries) {
        throw new Error(`All ${retries} attempts failed`);
      }
      await wait(baseDelay * 2 ** (attempt - 1)); // 500, 1000, 2000...
    }
  }
}

async function main() {
  try {
    await fetchWithRetry(3);
  } catch (err) {
    console.error("Giving up:", err.message);
  }
}

main();