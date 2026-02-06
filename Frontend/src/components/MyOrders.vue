<template>
  <div class="orders-page">
    <div class="container">
      <h2 class="page-title">My Orders</h2>

      <div v-if="loading" class="loader">Fetching your order history...</div>

      <div v-else-if="orders.length === 0" class="empty-orders">
        <div class="icon">🛍️</div>
        <h3>No orders yet!</h3>
        <p>Looks like you haven't placed any orders. Start shopping now!</p>
        <router-link to="/" class="shop-now-btn">Explore Products</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="header-info">
              <span class="label">ORDER PLACED</span>
              <span class="value">{{ formatDate(order.date) }}</span>
            </div>
            <div class="header-info">
              <span class="label">TOTAL</span>
              <span class="value">₹{{ order.total }}</span>
            </div>
            <div class="header-info order-id">
              <span class="label">ORDER # {{ order.id }}</span>
              <span class="status-badge" :class="(order.status || 'pending').toLowerCase()">
                {{ order.status || 'Pending' }}
              </span>
            </div>
          </div>

          <div class="order-body">
            <div v-for="(product, index) in order.items" :key="index" class="order-item">
              <img :src="product.image" :alt="product.name" class="item-img" />
              <div class="item-details">
                <h4 class="item-name">{{ product.name }}</h4>
                <p class="item-qty">Quantity: 1</p>
                <p class="item-price">Price: ₹{{ product.price }}</p>
              </div>
              <div class="item-actions">
                <button class="buy-again" @click="$router.push('/')">Buy it again</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyOrders',
  data() {
    return {
      orders: [],
      loading: true
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  async created() {
    if (!this.user) {
      this.$router.push('/login');
    } else {
      await this.fetchOrders();
    }
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const orderRes = await fetch(`${process.env.VUE_APP_API_BASE_URL}/orders?userId=${this.user.id}`);
        const orderData = await orderRes.json();

        const prodRes = await fetch(`${process.env.VUE_APP_API_BASE_URL}/products`);
        const allProducts = await prodRes.json();

        this.orders = orderData.map(order => ({
          ...order,
          items: (order.productIds || []).map(pId => {
            return allProducts.find(p => p.id === pId);
          }).filter(p => p) // Removes undefined if product not found
        })).reverse();

      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.orders-page { padding: 40px 0; background: #f0f2f5; min-height: 100vh; }
.container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
.page-title { margin-bottom: 25px; color: #232f3e; }

.order-card { 
  background: white; border: 1px solid #ddd; border-radius: 8px; 
  margin-bottom: 25px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.order-header { 
  background: #f6f6f6; padding: 15px 20px; display: flex; 
  gap: 40px; border-bottom: 1px solid #ddd; flex-wrap: wrap;
}
.header-info { display: flex; flex-direction: column; }
.label { font-size: 0.7rem; color: #565959; font-weight: bold; }
.value { font-size: 0.9rem; color: #333; }
.order-id { margin-left: auto; text-align: right; }

.status-badge { 
  font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; 
  font-weight: bold; margin-top: 5px; display: inline-block;
}
.status-badge.delivered { background: #e3fcef; color: #00875a; }
.status-badge.pending { background: #fff4e5; color: #b25e00; }

.order-body { padding: 20px; }
.order-item { 
  display: flex; gap: 20px; align-items: center; 
  padding-bottom: 15px; border-bottom: 1px solid #eee; margin-bottom: 15px;
}
.order-item:last-child { border-bottom: none; margin-bottom: 0; }

.item-img { width: 80px; height: 80px; object-fit: contain; border: 1px solid #eee; }
.item-details { flex: 1; }
.item-name { color: #007185; font-size: 1rem; margin-bottom: 5px; }
.item-qty, .item-price { font-size: 0.85rem; color: #555; }

.buy-again { 
  background: #ffd814; border: 1px solid #fcd200; 
  padding: 8px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem;
}

.empty-orders { text-align: center; padding: 60px; background: white; border-radius: 8px; }
.shop-now-btn { 
  display: inline-block; margin-top: 20px; background: #232f3e; 
  color: white; padding: 10px 25px; border-radius: 4px; text-decoration: none; 
}
</style>