<template>
  <header class="header">
    <div class="container">
      <div class="logo" @click="$router.push('/')">
        <span class="brand">E-KART</span>
      </div>

      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for products..."
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch">🔍</button>
      </div>

      <nav class="nav-links">
        <div class="cart-icon" @click="$emit('toggle-cart')">
          <span v-if="isLoggedIn" class="icon"
            ><router-link to="/cart">🛒</router-link></span
          >
          <span v-if="isLoggedIn && cartCount > 0" class="badge">
            {{ cartCount }}</span
          >
        </div>

        <button v-if="!isLoggedIn" class="login-btn" @click="goToLogin">
          Login
        </button>

        <div class="menu-container" v-else>
          <button class="menu-btn" @click="showMenu = !showMenu">
            Hi, {{ user.name }} ▾
          </button>

          <div v-if="showMenu" class="dropdown-menu" @click="showMenu = false">
            <router-link to="/my-profile">My Profile</router-link>
            <router-link to="/orders">My Orders</router-link>

            <router-link
              v-if="user && user.role === 'admin'"
              to="/add-product"
              class="admin-link"
            >
              ➕ Add Product
            </router-link>

            <hr />
            <button @click="handleLogout" class="logout-link">Logout</button>
          </div>
        </div>
        <div
          v-if="user && user.role === 'admin'"
          class="admin-store-link"
          @click="$router.push('/MyStore')"
        >
          My store
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { triggerCartCount } from "@/assets/Scripts/Global";
export default {
  name: "AppHeader",
  data() {
    return {
      searchQuery: "",
      showMenu: false,
    };
  },
  watch: {
    searchQuery() {
      this.handleSearch();
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    cartCount() {
      return this.$store.state.cartCount || 0;
    },
  },
  mounted() {
    triggerCartCount(this.$store.state.user.id);
  },
  methods: {
    handleSearch() {
      this.$store.commit("setSearchQuery", this.searchQuery);
    },

    goToLogin() {
      this.$router.push("/login");
    },
    handleLogout() {
      location.reload();
    },
  },
};
</script>

<style scoped>
.header {
  background: #232f3e;
  color: white;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}
.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff9900;
  cursor: pointer;
}
.search-box {
  flex: 1;
  display: flex;
  margin: 0 20px;
}
.search-box input {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px 0 0 4px;
}
.search-box button {
  background: #ff9900;
  border: none;
  padding: 0 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.menu-container {
  position: relative;
}
.menu-btn {
  background: #37475a;
  color: white;
  border: 1px solid #485769;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  color: #333;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dropdown-menu a,
.logout-link {
  padding: 12px 16px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  text-align: left;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
}
.dropdown-menu a:hover,
.logout-link:hover {
  background-color: #f1f1f1;
}
.admin-link {
  color: #2ecc71 !important;
  font-weight: bold;
}
.logout-link {
  border-top: 1px solid #eee;
  color: #e74c3c;
}
hr {
  margin: 0;
  border: 0;
  border-top: 1px solid #eee;
}

.admin-store-link {
  background: #ff9900;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
</style>
