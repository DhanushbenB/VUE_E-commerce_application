<template>
  <div class="cart-page">
    <div class="container">
      <h2>Shopping Cart</h2>

      <div v-if="loading" class="loader">Fetching your items...</div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <p>Your cart is empty. Time to fill it up!</p>
        <button @click="$router.push('/')">Go to Shop</button>
      </div>

      <div v-else class="cart-grid">
        <div class="items-column">
          <div v-for="item in cartItems" :key="item.id" class="item-card">
            <img :src="item.product.image" class="thumb" />

            <div class="details">
              <h3>{{ item.product.name }}</h3>
              <p class="category">{{ item.product.category }}</p>

              <div class="qty-actions">
                <button
                  @click="updateQuantity(item, -1)"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <span class="qty-num">{{ item.quantity }}</span>
                <button @click="updateQuantity(item, 1)">+</button>
              </div>
            </div>

            <div class="price-actions">
              <p class="price">₹{{ item.product.price * item.quantity }}</p>
              <button @click="deleteItem(item.id)" class="del-btn">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div class="summary-column">
          <div class="summary-box">
            <h3>Summary</h3>
            <div class="row">
              <span>Items ({{ totalItems }}):</span>
              <span>₹{{ totalPrice }}</span>
            </div>
            <div class="row">
              <span>Shipping:</span>
              <span class="green">FREE</span>
            </div>
            <hr />
            <div class="row grand-total">
              <span>Total:</span>
              <span>₹{{ totalPrice }}</span>
            </div>
            <button class="checkout-btn" @click="handleCheckout">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { triggerCartCount } from "@/assets/Scripts/Global";
export default {
  name: "CartPage",
  data() {
    return {
      cartItems: [],
      loading: true,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    totalItems() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalPrice() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
    },
  },
  created() {
    if (!this.user) {
      this.$router.push("/login");
    } else {
      this.getCartData();
    }
  },
  methods: {
    async getCartData() {
      this.loading = true;
      try {
        const cartRes = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/cart?userId=${this.user.id}`,
        );
        const cartEntries = await cartRes.json();
        const prodRes = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/products`,
        );
        const allProducts = await prodRes.json();

        this.cartItems = cartEntries
          .map((entry) => ({
            ...entry,
            product: allProducts.find((p) => p.id === entry.productId),
          }))
          .filter((item) => item.product);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        this.loading = false;
      }
    },

    async updateQuantity(item, change) {
      const newQty = item.quantity + change;
      try {
        await fetch(`${process.env.VUE_APP_API_BASE_URL}/cart/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQty }),
        });
        this.getCartData();
      } catch (err) {
        alert("Could not update quantity");
      }
    },

    async deleteItem(id) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Remove this item from cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        var response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/cart/${id}`,
          { method: "DELETE" },
        );
        if (response.ok) {
          this.$toast.success("Item removed from cart");
          this.getCartData();
          triggerCartCount(this.$store.state.user.id);
        } else {
          this.$toast.error("Unable to remove item. Try again later.");
        }
      }
    },

    async handleCheckout() {
      var newOrder = {
        userId: this.user.id,
        productIds: this.cartItems.map((item) => item.productId),
        total: this.totalPrice,
        date: new Date().toISOString(),
      };
      try {
        var response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/orders`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrder),
          },
        );
        if (response.ok) {
          this.$toast.success("Order placed successfully!");
          for (const item of this.cartItems) {
            await fetch(`${process.env.VUE_APP_API_BASE_URL}/cart/${item.id}`, {
              method: "DELETE",
            });
          }
        } else {
          this.$toast.error("Unable to place order. Try again later.");
        }

        this.getCartData();
      } catch (err) {
        this.$toast.error("Unable to place order. Try again later.");
      }
    },
  },
};
</script>

<style scoped>
.cart-page {
  padding: 50px 0;
  background: #f8f9fa;
  min-height: 100vh;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 15px;
}
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

.item-card {
  display: flex;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  align-items: center;
}
.thumb {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee;
}
.details {
  flex: 1;
  padding: 0 20px;
}
.category {
  color: #888;
  font-size: 0.9rem;
  margin: 5px 0;
}

.qty-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}
.qty-actions button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}
.qty-num {
  font-weight: bold;
}

.price-actions {
  text-align: right;
}
.price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #232f3e;
}
.del-btn {
  background: transparent;
  border: none;
  color: #d9534f;
  cursor: pointer;
  margin-top: 10px;
}

.summary-box {
  background: white;
  padding: 25px;
  border-radius: 8px;
  position: sticky;
  top: 100px;
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.grand-total {
  font-size: 1.4rem;
  font-weight: bold;
  color: #b12704;
}
.green {
  color: green;
  font-weight: bold;
}
.checkout-btn {
  width: 100%;
  background: #ffd814;
  border: 1px solid #fcd200;
  padding: 12px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
</style>
