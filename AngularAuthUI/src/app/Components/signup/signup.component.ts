import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import validateforms from 'src/app/helpers/validateforms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  signUpForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
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
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      let signUpObj = {
        ...this.signUpForm.value,
        role:'',
        token:''
      }
      this.auth.signUp(signUpObj)
      .subscribe({
        next:(res=>{
          console.log(res.message);
          this.signUpForm.reset();
          this.router.navigate(['login']);
          alert(res.message)
        }),
        error:(err=>{
          alert(err?.error.message)
        })
      })
    } else {
      validateforms.validateAllFormFields(this.signUpForm); //{7}
    }
  }

  // onSubmit() {
  //   if (this.signUpForm.valid){
  //    // console.log(this.signUpForm.value)
  //     //send the object to database
  //     this.auth.signUp(this.signUpForm.value).subscribe({
  //       next: (res => {
  //         alert(res.message);
  //         this.signUpForm.reset();
  //         this.router.navigate(['login'])
  //       }),
  //       error: (err => {
  //         alert(err?.error.message)
  //       })
  //     })
  //   } else {
  //     // console.log("Form is not valid")
  //     //throw the error using toaster and with required field
  //     validateforms.validateAllFormFields(this.signUpForm);
  //     alert("Your Form is invalid ")
  //   }
  // }

  // private validateAllFormFields(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);
  //     if (control instanceof FormControl) {
  //       control.markAsDirty({ onlySelf: true })
  //     } else if (control instanceof FormGroup) {
  //       this.validateAllFormFields(control)
  //     }
  //   })
  // }

}
