import { Navigate } from "react-router-dom";
import { store } from "../redux/store";
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = store?.getState()?.user?.account?.access_token;
  // console.log("check isAuthenticated?????", isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />; // Nếu đã đăng nhập, chuyển về dashboard hoặc trang chính
  }

  return children; // Nếu chưa đăng nhập, cho phép vào trang login
};

export default ProtectedRoute;
