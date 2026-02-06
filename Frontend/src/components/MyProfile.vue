<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-hero">
        <div class="hero-content">
          <div class="avatar-wrapper">
            <div class="avatar">{{ userInitial }}</div>
            <div class="status-indicator"></div>
          </div>
          <div class="hero-text">
            <h1>{{ user.name }}</h1>
            <div class="badge-group">
              <span class="role-badge" :class="user.role">{{ user.role }}</span>
              <span v-if="user.role === 'admin'" class="store-badge">
                <i class="fas fa-store"></i> {{ user.storeName }} Store
              </span>
            </div>
          </div>
        </div>
        <button class="logout-btn-top" @click="handleLogout">
          <span>Logout</span>
        </button>
      </div>

      <div class="profile-grid">
        <div class="info-card">
          <div class="card-header">
            <h3>Account Details</h3>
          </div>
          <div class="card-body">
            <div class="detail-item">
              <label>Email Address</label>
              <div class="detail-value">
                <i class="fas fa-envelope"></i> {{ user.email }}
              </div>
            </div>
            <div class="detail-item">
              <label>Unique User ID</label>
              <div class="detail-value">
                <i class="fas fa-fingerprint"></i> #{{ user.id }}
              </div>
            </div>
            <div class="detail-item">
              <label>Account Status</label>
              <div class="detail-value status-active">
                <i class="fas fa-check-circle"></i> Active
              </div>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="card-header">
            <h3>Profile Settings</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile" class="edit-stack">
              <div class="input-group">
                <label>Display Name</label>
                <div class="input-wrapper">
                  <input type="text" v-model="editName" :placeholder="user.name" />
                </div>
                <p class="input-hint">This is how your name will appear to others.</p>
              </div>
              <button type="submit" class="save-btn" :disabled="!isNameChanged">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      editName: ''
    };
  },
  computed: {
    user() { return this.$store.state.user; },
    userInitial() { return this.user?.name ? this.user.name.charAt(0).toUpperCase() : '?'; },
    isNameChanged() { return this.editName && this.editName !== this.user.name; }
  },
  created() {
    if (!this.user) {
      this.$router.push('/login');
    } else {
      this.editName = this.user.name;
    }
  },
  methods: {
    async updateProfile() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/users/${this.user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.editName })
        });

        if (response.ok) {
          const updatedUser = await response.json();
          this.$store.commit('SET_USER', updatedUser);
          this.$toast.success("Profile updated!");
        } else {
          this.$toast.error("Update failed.");
        }
      } catch (err) {
        console.error(err);
      }
    },
    handleLogout() {
      this.$store.commit('LOGOUT');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.profile-page {
  padding: 40px 0;
  background: #f4f7fa;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}
.container { max-width: 900px; margin: 0 auto; padding: 0 20px; }

.profile-hero {
  background: white;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  margin-bottom: 30px;
}
.hero-content { display: flex; align-items: center; gap: 20px; }

.avatar-wrapper { position: relative; }
.avatar {
  width: 90px; height: 90px;
  background: #232f3e; color: #ff9900;
  font-size: 2.5rem; font-weight: 700;
  display: flex; justify-content: center; align-items: center;
  border-radius: 24px;
}
.status-indicator {
  width: 18px; height: 18px;
  background: #2ecc71;
  border: 3px solid white;
  border-radius: 50%;
  position: absolute; bottom: 5px; right: 5px;
}

.hero-text h1 { font-size: 1.8rem; color: #1a202c; margin: 0; }
.badge-group { display: flex; gap: 10px; margin-top: 8px; }

.role-badge {
  padding: 4px 12px; border-radius: 8px; font-size: 0.75rem;
  font-weight: 600; text-transform: uppercase;
}
.role-badge.admin { background: #ebf8ff; color: #3182ce; }
.role-badge.user { background: #f0fff4; color: #38a169; }
.store-badge { font-size: 0.85rem; color: #ff9900; font-weight: 500; }

/* Grid Layout */
.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }

.info-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  overflow: hidden;
}
.card-header { padding: 20px; border-bottom: 1px solid #edf2f7; }
.card-header h3 { margin: 0; font-size: 1.1rem; color: #2d3748; }

.card-body { padding: 20px; }

/* Detail Items */
.detail-item { margin-bottom: 20px; }
.detail-item label { display: block; font-size: 0.8rem; color: #718096; margin-bottom: 6px; }
.detail-value { font-size: 1rem; color: #2d3748; display: flex; align-items: center; gap: 10px; }
.status-active { color: #38a169; font-weight: 600; }

/* Form Styles */
.edit-stack { display: flex; flex-direction: column; gap: 20px; }
.input-group label { display: block; font-size: 0.8rem; color: #718096; margin-bottom: 8px; }
.input-wrapper input {
  width: 93%; padding: 12px; border: 2px solid #edf2f7;
  border-radius: 10px; font-size: 1rem; transition: all 0.2s;
}
.input-wrapper input:focus { border-color: #232f3e; outline: none; }
.input-hint { font-size: 0.75rem; color: #a0aec0; margin-top: 6px; }

.save-btn {
  background: #232f3e; color: white; border: none;
  padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer;
}
.save-btn:disabled { background: #edf2f7; color: #a0aec0; cursor: not-allowed; }

.logout-btn-top {
  padding: 10px 20px; background: #fff5f5; color: #e53e3e;
  border: 1px solid #fed7d7; border-radius: 10px; font-weight: 600; cursor: pointer;
}

@media (max-width: 768px) {
  .profile-grid { grid-template-columns: 1fr; }
  .profile-hero { flex-direction: column; text-align: center; gap: 20px; }
  .hero-content { flex-direction: column; }
}
</style>