export function validateRegistrationFields(req) {
  //userName, age, email, mobile, voterId
  const { userName, age, email, password, mobile, voterId } = req.body;
  
  if(userName === undefined || userName === "") {
    throw new Error("userName is required");
  }
  if(age === undefined || age === "") {
    throw new Error("age is required");
  }
  if(email === undefined || email === "") {
    throw new Error("email is required");
  }
  if(password === undefined || password === "") { 
    throw new Error("password is required");
  } 
  if(mobile === undefined || mobile === "") {
    throw new Error("mobile is required");
  }
  if(voterId === undefined || voterId === "") {
    throw new Error("voterId is required");
  }
}
