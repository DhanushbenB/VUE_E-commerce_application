<template>
  <div class="store-page">
    <div class="container">
      <div class="store-header">
        <h2>My Inventory</h2>
        <p>Manage the products you've listed for sale.</p>
        <button class="add-new-btn" @click="$router.push('/add-product')">
          + Add New Product
        </button>
      </div>

      <div v-if="loading" class="loader">Loading your store...</div>

      <div v-else-if="myProducts.length === 0" class="empty-store">
        <div class="icon">📦</div>
        <h3>No products found</h3>
        <p>You haven't added any products to your store yet.</p>
      </div>

      <div v-else class="product-list">
        <table class="store-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in myProducts" :key="product.id">
              <td>
                <img :src="product.image" class="item-thumb" />
              </td>
              <td class="name-cell">{{ product.name }}</td>
              <td><span class="tag">{{ product.category }}</span></td>
              <td class="price">₹{{ product.price }}</td>
              <td>
                <div class="action-btns">
                  <button @click="editItem(product)" class="edit-btn">Edit</button>
                  <button @click="deleteItem(product.id)" class="delete-btn">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Edit Product</h3>
      <button class="close-btn" @click="showEditModal = false">&times;</button>
    </div>
    
    <form @submit.prevent="updateProduct">
      <div class="form-group">
        <label>Product Name</label>
        <input type="text" v-model="editingProduct.name" required />
      </div>

      <div class="form-group">
        <label>Price (₹)</label>
        <input type="number" v-model.number="editingProduct.price" required />
      </div>

      <div class="form-group">
        <label>Category</label>
        <select v-model="editingProduct.category">
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home & Kitchen</option>
        </select>
      </div>

      <div class="modal-actions">
        <button type="button" @click="showEditModal = false" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-changes-btn">Save Changes</button>
      </div>
    </form>
  </div>
</div>
  </div>
</template>

<script>
export default {
  name: 'MyStore',
  data() {
    return {
      myProducts: [],
      loading: true,
      showEditModal: false,
      editingProduct: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    if (!this.user) {
      this.$router.push('/login');
    } else {
      this.fetchMyProducts();
    }
  },
  methods: {
    async fetchMyProducts() {
      this.loading = true;
      try {
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/products?ownerId=${this.user.id}`);
        this.myProducts = await response.json();
      } catch (err) {
        console.error("Store fetch error:", err);
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(id) {
      if (confirm("Are you sure you want to remove this product from the store?")) {
        try {
          await fetch(`${process.env.VUE_APP_API_BASE_URL}/products/${id}`, { method: 'DELETE' });
          this.fetchMyProducts();
        } catch (err) {
          alert("Error deleting product");
        }
      }
    },
    editItem(product) {
        this.showEditModal = true;
    this.editingProduct = { ...product }; // Create a copy for editing
    },
    async updateProduct() {
    try {
      const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/products/${this.editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editingProduct)
      });

      if (response.ok) {
        this.showEditModal = false;
        this.fetchMyProducts(); 
        this.$toast.success("Product updated successfully!");
      }
    } catch (err) {
      this.$toast.error("Failed to update product");
    }
  }

  }
};
</script>

<style scoped>
.store-page { padding: 40px 0; background: #f8f9fa; min-height: 100vh; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }

.store-header { 
  display: flex; flex-direction: column; margin-bottom: 30px; 
  position: relative;
}
.add-new-btn { 
  position: absolute; right: 0; top: 0; background: #ff9900; 
  border: none; padding: 10px 20px; border-radius: 4px; 
  font-weight: bold; cursor: pointer; 
}

.product-list { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; }
.store-table { width: 100%; border-collapse: collapse; text-align: left; }
.store-table th { background: #232f3e; color: white; padding: 15px; }
.store-table td { padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; }

.item-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
.name-cell { font-weight: bold; color: #232f3e; }
.tag { background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
.price { font-weight: bold; color: #B12704; }

.action-btns { display: flex; gap: 10px; }
.edit-btn { background: #007185; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; }
.delete-btn { background: #cc0c39; color: white; border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer; }

.empty-store { text-align: center; padding: 50px; background: white; border-radius: 8px; }
.empty-store .icon { font-size: 4rem; margin-bottom: 10px; }

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* Modal Content */
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-changes-btn {
  padding: 10px 20px;
  background: #ff9900;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>