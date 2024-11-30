import { Component } from '@angular/core';
import axios from 'axios';  // Import axios

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errors: any = {};
  message = '';

  validateForm() {
    const errors: any = {};

    if (!this.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!this.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!this.password.trim()) {
      errors.password = 'Password is required';
    }
    if (this.password !== this.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    if (this.validateForm()) {
      if (this.validateForm()) {
        try {
          const response = await axios.post('http://159.203.90.56:3000/api/signup', {
            username: this.username,
            email : this.email,
            password: this.password,
          });
  
          console.log('Form submitted successfully!', response.data);
          this.message = 'Registration successful!';
        } catch (error: any) {
          if (error.response && error.response.data.error.includes('Duplicate Entry')) {
            this.message = 'Registration failed. Please check the form.';
            this.errors.server = error.response.data.error || 'Server error';
          } else {
            this.message = 'Registration failed. Please check the form.';
            this.errors.server = error.response.data.error || 'Server error';
          }
        }
      } else {
        console.log('Form validation failed');
        this.message = 'Please fill in all required fields.';
      }
      } else {
      this.message = 'Please correct the errors and try again.';
    }
  }
}
