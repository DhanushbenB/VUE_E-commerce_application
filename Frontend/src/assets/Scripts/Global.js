import store from "@/store";

export async function triggerCartCount(userId) {
  const response = await fetch(
    `${process.env.VUE_APP_API_BASE_URL}/cart?userId=${userId}`,
  );

  if (response.ok) {
    console.log("Cart count updated successfully");
    console.log("Response:", response);
    const data = await response.json();
    console.log("Cart items:", data.length);
    store.commit("setCartCount", data.length);
  }
}
