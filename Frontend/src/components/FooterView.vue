<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3 class="footer-logo">E-KART</h3>
        <p>Your one-stop shop for everything tech and lifestyle. Quality products, delivered to your doorstep.</p>
        <div class="social-icons">
          <span>🌐</span> <span>📸</span> <span>🐦</span>
        </div>
      </div>

      <div class="footer-section">
        <h4>Shop Categories</h4>
        <ul>
          <li v-for="cat in categories" :key="cat">
            <a href="#" @click.prevent>{{ cat }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Help & Support</h4>
        <ul>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Shipping Policy</a></li>
          <li><a href="#">Returns & Refunds</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Stay Updated</h4>
        <p>Subscribe to get special offers.</p>
        <div class="newsletter">
          <input 
            type="email" 
            v-model="newsletterEmail" 
            placeholder="Enter email"
          />
          <button @click="subscribe">Join</button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} E-KART Inc. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      newsletterEmail: '',
      categories: ['Electronics', 'Fashion', 'Home Decor', 'Gadgets']
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  },
  methods: {
    subscribe() {
      if (this.newsletterEmail) {
        alert(`Thank you for subscribing, ${this.newsletterEmail}!`);
        this.newsletterEmail = '';
      } else {
        alert('Please enter a valid email.');
      }
    }
  }
};
</script>

<style scoped>
.footer {
  background: #131921;
  color: #dddddd;
  padding: 40px 0 20px 0;
  margin-top: 50px;
}
.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  padding: 0 20px;
}
.footer-logo {
  color: #ff9900;
  margin-bottom: 15px;
}
.footer-section h4 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.1rem;
}
.footer-section ul {
  list-style: none;
  padding: 0;
}
.footer-section ul li {
  margin-bottom: 10px;
}
.footer-section a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.9rem;
}
.footer-section a:hover {
  text-decoration: underline;
  color: #ff9900;
}
.newsletter {
  display: flex;
  margin-top: 10px;
}
.newsletter input {
  padding: 8px;
  border: none;
  border-radius: 4px 0 0 4px;
  width: 100%;
}
.newsletter button {
  background: #ff9900;
  border: none;
  padding: 0 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-weight: bold;
}
.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #3a4553;
  font-size: 0.8rem;
}
</style>