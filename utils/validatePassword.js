import bcrypt from "bcrypt";

const validatePassword = (password, originalPassword) =>
  bcrypt.compareSync(password, originalPassword);

export default validatePassword;
