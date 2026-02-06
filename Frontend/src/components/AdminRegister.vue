<template>
  <div class="register-container">
    <div class="register-card">
      <div class="header">
        <h2>Admin Registration</h2>
        <p>Create a vendor account to sell products.</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="text-start">Full Name</label>
          <input
            type="text"
            v-model="formData.name"
            placeholder="John Doe"
            required
          />
        </div>

        <div class="form-group">
          <label class="text-start">Email Address</label>
          <input
            type="email"
            v-model="formData.email"
            placeholder="admin@ekart.com"
            required
          />
        </div>

        <div class="form-group">
          <label class="text-start">Password</label>
          <input
            type="password"
            v-model="formData.password"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="form-group">
          <label class="text-start">Store Name</label>
          <input
            type="text"
            v-model="formData.storeName"
            placeholder="e.g., Global Tech Store"
            required
          />
        </div>

        <button type="submit" class="reg-btn" :disabled="loading">
          {{ loading ? "Creating Account..." : "Register as Admin" }}
        </button>
      </form>

      <p class="footer-link">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterAdmin",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
        storeName: "",
        role: "admin",
      },
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      try {
        const checkRes = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/users?email=${this.formData.email}`,
        );
        const existingUsers = await checkRes.json();

        if (existingUsers.length > 0) {
          this.$toast.error("Email already registered!");
          return;
        }
        if(this.formData.password.length < 6){
          this.$toast.error("Password must be at least 6 characters.");
          return;
        }

        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/users`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.formData),
          },
        );

        if (response.ok) {
          const newUser = await response.json();
          this.$emit("toggle-header", true);
          this.$store.commit("SET_USER", newUser);

          this.$toast.success("Registration Successful!");
          this.$router.push("/");
        } else {
          this.$toast.error("Registration failed. Please try again.");
        }
      } catch (err) {
        alert("Server error. Is JSON-Server running?");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  background: #f4f7f6;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}
.header h2 {
  color: #232f3e;
  margin-bottom: 10px;
}
.header p {
  color: #666;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 0.85rem;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.reg-btn {
  width: 100%;
  padding: 12px;
  background: #232f3e;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.reg-btn:hover {
  background: #37475a;
}
.reg-btn:disabled {
  background: #999;
}

.footer-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
}
.footer-link a {
  color: #ff9900;
  text-decoration: none;
  font-weight: bold;
}
</style>
