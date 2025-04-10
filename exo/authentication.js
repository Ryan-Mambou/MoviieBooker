import jwt from "jsonwebtoken";

const SECRET_KEY = "secret";

const generateToken = (user) => {
  const { username, email } = user;
  const token = jwt.sign({ username, email }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
};

const token = generateToken({ username: "John", email: "john@example.com" });
console.log(token);

const decoded = verifyToken(token);
console.log(decoded);
