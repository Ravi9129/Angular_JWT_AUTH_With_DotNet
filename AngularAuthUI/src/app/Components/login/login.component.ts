import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import validateforms from 'src/app/helpers/validateforms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  loginForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash"
    this.isText ? this.type = "text" : this.type = "password"
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      //send the object to database
    } else {
      // console.log("Form is not valid")
      //throw the error using toaster and with required field
      validateforms.validateAllFormFields(this.loginForm);
      alert("Your Form is invalid ")
    }
  }


}
