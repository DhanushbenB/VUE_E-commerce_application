<template>
  <div>
    <div class="dashboard">
      <div class="container">
        <h1 class="page-title">Featured Products</h1>

        <div v-if="loading" class="loader">Loading products...</div>

        <div v-else class="product-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="image-container">
              <img :src="product.image" :alt="product.name" />
              <span class="category-tag">{{ product.category }}</span>
            </div>

            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">
                {{ truncateText(product.description) }}
              </p>

              <div class="product-footer">
                <span class="price">₹{{ product.price }}</span>
                <button class="add-btn" @click="addToCart(product)">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>

          <span class="page-info">Page {{ currentPage }}</span>

          <button
            class="page-btn"
            :disabled="!hasMore"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { triggerCartCount } from "@/assets/Scripts/Global";
export default {
  name: "DashboardPage",

  data() {
    return {
      products: [],
      loading: false,
      currentPage: 1,
      limit: 200,
      hasMore: true,
    };
  },

  mounted() {
    this.fetchProducts();
  },
  watch: {
    searchQuery() {
      this.fetchProducts();
    },
  },

  computed: {
    filteredProducts() {
      const query = this.$store.state.searchQuery.toLowerCase();

      if (!query) return this.products;

      return this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    },
  },

  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/products?_page=${this.currentPage}&_limit=${this.limit}`,
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const serverData = await response.json();

        if (this.currentPage === 1) {
          const staticDatas = [
            // { id: "s1", name: "iPhone 14", price: 800, category: "Electronics", image: "...", description: "..." },
            // { id: "s2", name: "Leather Jacket", price: 120, category: "Fashion", image: "...", description: "..." }
          ];
          this.products = [...staticDatas, ...serverData];
        } else {
          this.products = serverData;
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    truncateText(text) {
      if (!text) return "";
      return text.length > 60 ? text.substring(0, 60) + "..." : text;
    },

    changePage(page) {
      this.currentPage = page;
      this.fetchProducts();
      window.scrollTo(0, 0);
    },

    async addToCart(product) {
      try {
        var newCartItem = {
          productId: product.id,
          quantity: 1,
          userId: this.$store.state.user.id,
        };
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newCartItem),
          },
        );

        if (response.ok) {
          this.fetchProducts();
          this.$toast.success("Product added to cart!");
          triggerCartCount(this.$store.state.user.id);
        } else {
          this.$toast.error("Failed to add product to cart.");
        }
      } catch (error) {
        alert("Error: Make sure your JSON Server is running!");
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 40px 0;
  background: #f7f8f9;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
}

.page-title {
  margin-bottom: 30px;
  color: #232f3e;
  font-size: 1.8rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.image-container {
  height: 200px;
  position: relative;
  background: #eee;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 153, 0, 0.9);
  color: white;
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 4px;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #232f3e;
}

.product-desc {
  font-size: 0.85rem;
  color: #666;
  height: 40px;
  margin-bottom: 15px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #b12704;
}

.add-btn {
  background: #ffd814;
  border: 1px solid #fcd200;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.85rem;
}

.add-btn:hover {
  background: #f7ca00;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.page-btn {
  background: #232f3e;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-weight: bold;
  color: #232f3e;
}

.loader {
  text-align: center;
  font-size: 1.5rem;
  padding: 50px;
}
</style>
