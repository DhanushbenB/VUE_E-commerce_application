<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login to E-KART</h2>
      <p class="subtitle">Enter your details to track your orders</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="loginData.email" placeholder="email@example.com" required/>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="loginData.password"  placeholder="••••••••" required/>
        </div>

        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Authenticating...' : 'Login' }}
        </button>
      </form>

      <p class="footer-text">
        New to E-KART? <a href=""><router-link to="/Register">Create an account</router-link></a>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LoginView',
  data() {
    return {
      loading: false,
      loginData: {
        email: '',
        password: ''
      }
    };
  },
  mounted(){
         this.$emit('toggle-header', false);
  },
  methods: {
    handleLogin() {
      this.loading = true;

      setTimeout(() => {
        
        const user = {
  email: this.loginData.email,
  password: this.loginData.password,
};

fetch(`${process.env.VUE_APP_API_BASE_URL}/users?email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}`)
  .then(res => {
    if (!res.ok) throw new Error('HTTP error ' + res.status);
    return res.json();
  })
  .then(data => {
    if (data.length > 0) {
        this.$emit('toggle-header', true);
        this.$store.commit('SET_USER', data[0]);
        this.$router.push('/');
    } else {
      this.$toast.error("Invalid email or password");
    }
  })
  .catch(() => {
  this.$toast.error("Login failed. Please try again later.");
})     
        this.loading = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
h2 {
  color: #232f3e;
  margin-bottom: 10px;
  text-align: center;
}
.subtitle {
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 30px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.85rem;
}
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Ensures padding doesn't affect width */
}
input:focus {
  border-color: #ff9900;
  outline: none;
}
.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #ff9900;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
.login-btn:hover {
  background-color: #e68a00;
}
.login-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.footer-text {
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
}
.footer-text a {
  color: #ff9900;
  text-decoration: none;
}
</style>