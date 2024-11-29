class UserProfileManagement {
    constructor() {
      this.state = {
        isEditing: false,
        userData: {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '+9876543210',
          subscription: 'Premium'
        },
        errors: {}
      };
  
      this.init();
    }
  
    init() {
      this.attachEventListeners();
      this.render();
    }
  
    attachEventListeners() {
      const editButton = document.querySelector('.edit-button');
      editButton?.addEventListener('click', () => this.toggleEdit());
  
      const form = document.querySelector('.edit-form');
      form?.addEventListener('submit', (e) => this.handleSubmit(e));
  
      const cancelButton = document.querySelector('.cancel-button');
      cancelButton?.addEventListener('click', () => this.cancelEdit());
    }
  
    toggleEdit() {
      this.state.isEditing = !this.state.isEditing;
      this.render();
    }
  
    cancelEdit() {
      this.state.isEditing = false;
      this.state.errors = {};
      this.render();
    }
  
    validateForm(formData) {
      const errors = {};
      
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'Phone is required';
      } else if (!/^\+?\d{10,}$/.test(formData.phone)) {
        errors.phone = 'Invalid phone format';
      }
  
      return errors;
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      
      const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        subscription: this.state.userData.subscription
      };
  
      const errors = this.validateForm(formData);
      
      if (Object.keys(errors).length > 0) {
        this.state.errors = errors;
        this.render();
        return;
      }
  
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.state.userData = formData;
        this.state.isEditing = false;
        this.state.errors = {};
        this.render();
        
        // Announce successful update to screen readers
        this.announceUpdate('Profile successfully updated');
      } catch (error) {
        this.state.errors.submit = 'Failed to update profile. Please try again.';
        this.render();
      }
    }
  
    announceUpdate(message) {
      const announcer = document.getElementById('live-announcer');
      if (announcer) {
        announcer.textContent = message;
      }
    }
  
    render() {
      const mainContent = document.querySelector('.profile-info');
      if (!mainContent) return;
  
      const { isEditing, userData, errors } = this.state;
  
      mainContent.innerHTML = `
        <h3 class="section-title">User Profile Information</h3>
        
        ${isEditing ? `
          <form class="edit-form active" novalidate>
            <div class="form-group">
              <label for="name" class="form-label">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                class="form-input ${errors.name ? 'error' : ''}"
                value="${userData.name}"
                aria-invalid="${errors.name ? 'true' : 'false'}"
                aria-describedby="${errors.name ? 'name-error' : ''}"
              >
              ${errors.name ? `
                <div id="name-error" class="error-message" role="alert">
                  ${errors.name}
                </div>
              ` : ''}
            </div>
  
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input ${errors.email ? 'error' : ''}"
                value="${userData.email}"
                aria-invalid="${errors.email ? 'true' : 'false'}"
                aria-describedby="${errors.email ? 'email-error' : ''}"
              >
              ${errors.email ? `
                <div id="email-error" class="error-message" role="alert">
                  ${errors.email}
                </div>
              ` : ''}
            </div>
  
            <div class="form-group">
              <label for="phone" class="form-label">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                class="form-input ${errors.phone ? 'error' : ''}"
                value="${userData.phone}"
                aria-invalid="${errors.phone ? 'true' : 'false'}"
                aria-describedby="${errors.phone ? 'phone-error' : ''}"
              >
              ${errors.phone ? `
                <div id="phone-error" class="error-message" role="alert">
                  ${errors.phone}
                </div>
              ` : ''}
            </div>
  
            <div class="button-group">
              <button type="submit" class="save-button">Save Changes</button>
              <button type="button" class="cancel-button">Cancel</button>
            </div>
  
            ${errors.submit ? `
              <div class="error-message" role="alert">
                ${errors.submit}
              </div>
            ` : ''}
          </form>
        ` : `
          <div class="profile-details">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7e194133f1bbcc630f60a6868f55a3358d6b4ea3140e548b9923ef420e5571d2?placeholderIfAbsent=true&apiKey=9c57376e58b948ef9d9c653dc00f4ea4" alt="Jane Doe's Profile Picture" class="profile-photo">
            <div class="user-info">
              <p>Name: ${userData.name}</p>
              <p>Email: ${userData.email}</p>
            </div>
          </div>
  
          <div class="contact-info">
            <div class="user-info">
              <p>Phone: ${userData.phone}</p>
              <p>Subscription: ${userData.subscription}</p>
            </div>
            <button 
              class="edit-button" 
              aria-label="Edit Profile"
              onclick="this.toggleEdit()"
            >
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/2429e2090c4abaa5c0239f244e593716b086d0bf7037a48e04e148e1e221a7cd?placeholderIfAbsent=true&apiKey=9c57376e58b948ef9d9c653dc00f4ea4" alt="" class="edit-icon">
              Edit
            </button>
          </div>
        `}
      `;
  
      this.attachEventListeners();
    }
  }
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    new UserProfileManagement();
  });