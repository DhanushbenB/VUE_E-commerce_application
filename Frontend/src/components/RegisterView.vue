<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Create Account</h2>
      <p class="subtitle">Join E-KART today for the best deals</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="text-start">Email Address</label>
          <input 
            type="email" 
            v-model="userData.email" 
            placeholder="example@mail.com" 
            required
          />
        </div>

        <div class="form-group">
          <label class="text-start">Password</label>
          <input 
            type="password" 
            v-model="userData.password" 
            placeholder="Min. 6 characters" 
            required
          />
        </div>

        <div class="form-group">
          <label class="text-start">Confirm Password</label>
          <input 
            type="password" 
            v-model="userData.confirmPassword" 
            placeholder="Repeat your password" 
            required
          />
        </div>


        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p class="footer-text">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>

      <p class="footer-text">
  Have a store?
  <router-link to="/admin-register">Register as an admin</router-link>
</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      loading: false,
      userData: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    handleRegister() {
      this.error = null;

      if (this.userData.password.length < 6) {
        this.$toast.error("Password must be at least 6 characters.");
        return;
      }

      if (this.userData.password !== this.userData.confirmPassword) {
          this.$toast.error("Passwords do not match!");
        return;
      }

      this.loading = true;
      setTimeout(() => {
        const newUser = {
          name: this.userData.email.split('@')[0],
          role:'user',
          email: this.userData.email,
          password: this.userData.password};
        

        fetch(`${process.env.VUE_APP_API_BASE_URL}/users`, {
           method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
  .then(res => {
    if (!res.ok) throw new Error('Registration failed')
    return res.json()
  })
  .then(data => {
            this.$emit('toggle-header', true);
    this.$store.commit('SET_USER', data)
    this.$router.push('/')
    this.$toast.success('Registration successful! Welcome to E-KART.')
  })
  .catch(() => { this.$toast.error('Registration failed. Please try again later.')
  });

        this.loading = false;
      }, 1200);
    },
    
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f4f7f6;
  padding: 20px;
}
.register-card {
  background: white;
  padding: 35px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
h2 {
  color: #232f3e;
  margin-bottom: 5px;
  text-align: center;
}
.subtitle {
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 25px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 0.85rem;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
input:focus {
  border-color: #ff9900;
  outline: none;
}
.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-bottom: 15px;
}
.register-btn {
  width: 100%;
  padding: 12px;
  background-color: #ff9900;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.register-btn:disabled {
  background-color: #ccc;
}
.footer-text {
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
}
.footer-text a {
  color: #ff9900;
  text-decoration: none;
  font-weight: bold;
}
</style>