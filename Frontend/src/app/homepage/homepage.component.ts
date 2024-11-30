import { AfterViewInit, Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent{
  username = '';
  password = '';
  errors: any = {};
  message = '';

  constructor(private router: Router) {} // Inject Router

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if a token exists
  }

  validateForm() {
    const errors: any = {};

    if (!this.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!this.password.trim()) {
      errors.password = 'Password is required';
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (this.validateForm()) {
      try {
        const response = await axios.post('http://159.203.90.56:3000/api/login', {
          username: this.username,
          password: this.password,
        });

        console.log('Login successful!', response.data);
        localStorage.setItem('token', response.data.token); // Save the token in localStorage
        this.message = 'Login successful!';
        this.router.navigate(['/dashboard']); // Use the Angular Router to navigate
      } catch (error: any) {
        this.message = 'Login failed. Please check the form.';
        this.errors.server = error.response?.data?.message|| 'Server error';
      }
    } else {
      console.log('Form validation failed');
      this.message = 'Please fill in all required fields.';
    }
  }
}
