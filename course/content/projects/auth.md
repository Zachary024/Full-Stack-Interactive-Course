::: project secure-login Build a secure sign-up and login system
Time: 5-6 hours
Level: Intermediate
Skills: password hashing, tokens, sessions, authorisation, input validation, common attacks

Add accounts to an API you have built (the bookmarks API is ideal). Users must be able to register, log in, see only their own data and, if they are administrators, manage everyone's. Then attack your own system the way a real attacker would, and fix what you find. The password rules are pure logic, so the starter shows them in every language.

Requirements:
- `POST /auth/register` validates the email and a strong password, and stores only a salted hash made with bcrypt or Argon2. The plain password is never stored or logged.
- A password policy function returns every problem with a candidate password: fewer than 12 characters, no lowercase, no uppercase, no digit, or a match with a short list of very common passwords.
- `POST /auth/login` returns a signed token that expires, such as a JSON Web Token valid for 15 minutes. A wrong email and a wrong password give the same message, and take a similar time.
- Protected routes check the token with middleware and return 401 for a missing or invalid token and 403 for a valid token without permission.
- Each bookmark belongs to a user. Users can read and change only their own bookmarks, and asking for someone else's returns 404, not 403.
- Two roles exist: `user` and `admin`. Only admins can list all users and delete a user. Roles are read from the server's data, never from anything the client sends.
- Login attempts are rate limited per address and per account, with a clear 429 response.
- The secret used to sign tokens comes from an environment variable. The server refuses to start in production without it, and the secret is never committed.
- Security headers are set (for example with Helmet), the CORS policy allows only the origins you expect, and request bodies have a size limit.
- Write a short security review that tests at least five attacks from the course (for example SQL injection, XSS in a bookmark title, a forged token, changing another user's id in the URL, and brute-forcing the login) and records the result of each.

Steps:
1. Implement and test the password policy function using the starter.
2. Add the users table or collection, and the registration route with hashing.
3. Add login and token creation, then the authentication middleware.
4. Attach each bookmark to a user, and enforce ownership on every route.
5. Add roles and the admin routes.
6. Add the rate limiter, headers, CORS and the body size limit.
7. Carry out the five attacks, record what happens and fix any that succeed.

Starter:
```javascript
const COMMON = ["password1234", "123456789012", "qwertyuiop12", "letmein12345"];

// Returns an array of problems. An empty array means the password is acceptable.
function passwordProblems(pw) {
  const problems = [];
  if (pw.length < 12) problems.push("use at least 12 characters");
  // TODO: lowercase, uppercase, digit, common passwords
  return problems;
}

console.log(passwordProblems("hello"));
```
```python
COMMON = ["password1234", "123456789012", "qwertyuiop12", "letmein12345"]


def password_problems(pw):
    """Return a list of problems. An empty list means the password is acceptable."""
    problems = []
    if len(pw) < 12:
        problems.append("use at least 12 characters")
    # TODO: lowercase, uppercase, digit, common passwords
    return problems


print(password_problems("hello"))
```
```java
import java.util.*;

public class PasswordPolicy {
    static final List<String> COMMON = List.of("password1234", "123456789012", "qwertyuiop12", "letmein12345");

    static List<String> passwordProblems(String pw) {
        List<String> problems = new ArrayList<>();
        if (pw.length() < 12) problems.add("use at least 12 characters");
        // TODO: lowercase, uppercase, digit, common passwords
        return problems;
    }

    public static void main(String[] args) {
        System.out.println(passwordProblems("hello"));
    }
}
```
```csharp
using System;
using System.Collections.Generic;

class PasswordPolicy
{
    static readonly string[] Common = { "password1234", "123456789012", "qwertyuiop12", "letmein12345" };

    static List<string> PasswordProblems(string pw)
    {
        var problems = new List<string>();
        if (pw.Length < 12) problems.Add("use at least 12 characters");
        // TODO: lowercase, uppercase, digit, common passwords
        return problems;
    }

    static void Main()
    {
        Console.WriteLine(string.Join(", ", PasswordProblems("hello")));
    }
}
```
```php
<?php
const COMMON = ["password1234", "123456789012", "qwertyuiop12", "letmein12345"];

function passwordProblems(string $pw): array {
    $problems = [];
    if (strlen($pw) < 12) $problems[] = "use at least 12 characters";
    // TODO: lowercase, uppercase, digit, common passwords
    return $problems;
}

print_r(passwordProblems("hello"));
```
```go
package main

import "fmt"

var common = []string{"password1234", "123456789012", "qwertyuiop12", "letmein12345"}

func passwordProblems(pw string) []string {
	var problems []string
	if len(pw) < 12 {
		problems = append(problems, "use at least 12 characters")
	}
	// TODO: lowercase, uppercase, digit, common passwords
	return problems
}

func main() {
	fmt.Println(passwordProblems("hello"))
}
```
```ruby
COMMON = %w[password1234 123456789012 qwertyuiop12 letmein12345].freeze

def password_problems(pw)
  problems = []
  problems << "use at least 12 characters" if pw.length < 12
  # TODO: lowercase, uppercase, digit, common passwords
  problems
end

p password_problems("hello")
```

Hints:
- Never write your own hashing. Use the bcrypt or Argon2 library, and let it generate the salt.
- Compare tokens and hashes only with the library's functions, which are built to be safe against timing attacks.
- Ownership check: load the bookmark with both its id and `userId = req.user.id`. If nothing comes back, answer 404.
- Put the user id into the token when it is created, and look the user up again on each request if roles can change.

Stretch:
- Add refresh tokens stored in an HttpOnly cookie, with rotation.
- Add two-factor authentication with a time-based one-time password.
- Add an audit log of logins, failures and admin actions.

Deliver:
- The updated API and its README.
- The security review: each attack, the request you used, what happened and what you changed.

Rubric:
- Credentials | Passwords are hashed correctly, the policy works and errors do not reveal whether an account exists.
- Access control | Authentication and authorisation are enforced on every route, including ownership and roles.
- Hardening | Rate limiting, headers, CORS, body limits and secrets handling are in place.
- Evidence | The security review shows real tests with clear results, and any failures were fixed and retested.
:::
