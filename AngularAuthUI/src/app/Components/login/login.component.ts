import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import validateforms from 'src/app/helpers/validateforms';
import { AuthService } from 'src/app/services/auth.service';

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
  constructor(private fb: FormBuilder, 
    private auth: AuthService, 
    private router:Router,
    private toast:NgToastService
    
    ) { }

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

  //  console.log(this.loginForm.value)
      //send the object to database
     // this.auth.login(this.loginForm.value).subscribe({
       // alert(res.message);

  onLogin() {
    if (this.loginForm.valid) {
    
        this.auth.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res.message)
          this.loginForm.reset();
      
          this.toast.success({detail:"Success",summary:res.message,duration:5000})
          this.router.navigate(['dashboard'])
        },
        error: (err) => {
         // alert(err.error.message)
          this.toast.error({detail:"Erorr",summary:"Something when wrong",duration:5000})
        }
      })

    } else {
      // console.log("Form is not valid")
      //throw the error using toaster and with required field
      validateforms.validateAllFormFields(this.loginForm);
      alert("Your Form is invalid ")
    }
  }


}
