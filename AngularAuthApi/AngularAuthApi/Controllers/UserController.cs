using AngularAuthApi.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Renci.SshNet.Messages;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.RegularExpressions;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace AngularAuthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authContext;
        public UserController(AppDbContext appDbContext)
        {

            _authContext = appDbContext;

        }
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj
            )
        {
            if (userObj == null)
                return BadRequest();

            var user = await _authContext.Users
                .FirstOrDefaultAsync(x => x.Username == userObj.Username);
            //   var user = await _authContext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username && x.Password==userObj.Password);
            if (user == null)
                return NotFound(new { Message = "User Not Found!" });

            if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
            {
                return BadRequest(new { Message = "Password is incorrect" });
            }


            user.Token = CreateJwt(user);


            return Ok(new
       {
                Token= user.Token,
                Message = "Login Success!"
       });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if(userObj == null)
                return BadRequest();

            //Check username
            if(await CheckUserNameExistAsync(userObj.Username))
                return BadRequest(new {Message="Username Already Exist!"});


            //check email

            if (await CheckEmailExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email Already Exist!" });


            //check password strength
            var passMessage = CheckPasswordStrength(userObj.Password);
            if(!string.IsNullOrEmpty(passMessage))
                return BadRequest(new { Message = passMessage.ToString() });


            //   if(string.IsNullOrEmpty(userObj.Username))
            userObj.Password=PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";
            await _authContext.Users.AddAsync(userObj);
            await _authContext.SaveChangesAsync();
            return Ok(new
            {

                Message = "User Registered"
            }) ;
        }

        private  Task<bool> CheckUserNameExistAsync(string username)
            => _authContext.Users.AnyAsync(x => x.Username == username);
        //or u can write below both are same
        //   private async Task<bool>CheckUserNameExistAsync(string username)
        //  { return await _authContext.Users.AnyAsync(x => x.Username == username); }


        //email
        private Task<bool> CheckEmailExistAsync(string email)
         => _authContext.Users.AnyAsync(x => x.Email == email);

        //pass


        /*
                private static string CheckPasswordStrength(string pass)
                {
                    StringBuilder sb = new StringBuilder();
                    if(pass.Length<9)
                    {
                        sb.Append("Minimum password length should be 8" + Environment.NewLine);
                    }
                    if (!(Regex.IsMatch(pass, "[a-z]") && Regex.IsMatch(pass, "[A-Z]") && Regex.IsMatch(pass, "[0-9]"))) ;
                      sb.Append("Password Should be Alphanumeric" + Environment.NewLine);
                    if (!Regex.IsMatch(pass, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,-,`,~,=]")) 
                    sb.Append("Password Should Contain special chars" + Environment.NewLine);
                    return sb.ToString();

                }

                */
        private static string CheckPasswordStrength(string pass)
        {
            StringBuilder sb = new StringBuilder();
            if (pass.Length < 9)
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
            if (!(Regex.IsMatch(pass, "[a-z]") && Regex.IsMatch(pass, "[A-Z]") && Regex.IsMatch(pass, "[0-9]")))
                sb.Append("Password should be AlphaNumeric" + Environment.NewLine);
            if (!Regex.IsMatch(pass, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',\\,.,/,~,`,-,=]"))
                sb.Append("Password should contain special charcter" + Environment.NewLine);
            return sb.ToString();
        }

        //jwt
        private string CreateJwt(User user)
        {
            var jwtTokenHandler=new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.FirstName} {user.LastName} ")
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials,
            };
            var token=jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        [HttpGet]
        public async Task<ActionResult<User>>GetAllUser()
        {
            return Ok(await _authContext.Users.ToListAsync());

        }
    }
}
