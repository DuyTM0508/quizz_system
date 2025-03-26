import { Navigate } from "react-router-dom";
import { store } from "../redux/store";

function AdminRoute({ children }) {
  const isAdmin = store?.getState()?.user?.account?.role;
  console.log("check isAdmin ahihi?>>>>>>.", isAdmin);
  // Nếu chưa đăng nhập hoặc không phải admin -> chuyển hướng về trang chủ
  if (!isAdmin ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
