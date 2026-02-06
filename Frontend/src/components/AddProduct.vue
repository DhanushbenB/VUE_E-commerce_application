<template>
  <div class="admin-container">
    <div class="form-card">
      <h2>Add New Product</h2>
      <form @submit.prevent="submitProduct">
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Product Name</label>
            <input type="text" v-model="product.name" placeholder="Item name" required />
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="product.category" required>
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Kitchen</option>
            </select>
          </div>

          <div class="form-group">
            <label>Price (₹)</label>
            <input type="number" v-model.number="product.price" step="0.01" required />
          </div>

          <div class="form-group full-width">
            <label>Product Image</label>
            <input type="file" @change="onFileChange" accept="image/*" required />
            <div v-if="product.image" class="image-preview">
              <img :src="product.image" alt="Preview" />
            </div>
          </div>

          <div class="form-group full-width">
            <label>Description</label>
            <textarea v-model="product.description" rows="3"></textarea>
          </div>
        </div>

        <button type="submit" class="save-btn" :disabled="isUploading">
          {{ isUploading ? 'Processing...' : 'Publish Product' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isUploading: false,
      product: {
        name: '',
        price: '',
        category: '',
        image: '', 
        description: '',
        ownerId: this.$store.state.user.id
      }
    };
  },
  methods: {
   onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return

  const img = new Image()
  const reader = new FileReader()

  reader.onload = (ev) => {
    img.src = ev.target.result
  }

  img.onload = () => {
    const canvas = document.createElement('canvas')
    const MAX_WIDTH = 400
    const scale = MAX_WIDTH / img.width

    canvas.width = MAX_WIDTH
    canvas.height = img.height * scale

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    this.product.image = canvas.toDataURL('image/jpeg', 0.6)
  }

  reader.readAsDataURL(file)
},


    async submitProduct() {
      this.isUploading = true;
      
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.product)
        });

        if (response.ok) {
          this.$router.push('/'); 
          this.$toast.success("Product added successfully!");
        } else {
          this.$toast.error("Failed to add product.");
        }
      } catch (error) {
        this.$toast.error('Error: Make sure your JSON Server is running!');
      } finally {
        this.isUploading = false;
      }
    }
  }
};
</script>

<style scoped>
.admin-container { padding: 40px; display: flex; justify-content: center; }
.form-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 600px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.full-width { grid-column: span 2; }
.form-group label { display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; }
input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }

.image-preview { margin-top: 10px; border: 1px dashed #ccc; padding: 5px; border-radius: 4px; }
.image-preview img { max-height: 150px; display: block; margin: 0 auto; }

.save-btn { width: 100%; margin-top: 20px; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.save-btn:disabled { background: #95a5a6; }
</style>