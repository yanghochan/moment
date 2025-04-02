<<<<<<< HEAD
// RegisterPage.jsx
import AuthForm from "../components/AuthForm";
export default function Register() {
  return <AuthForm type="register" />;
=======
//  Register.jsx
import AuthForm from "../components/AuthForm";

export default function Register() {
  return <AuthForm type="register" allowAdmin={false} />;
>>>>>>> bff76f3 ('25.04.03)
}
