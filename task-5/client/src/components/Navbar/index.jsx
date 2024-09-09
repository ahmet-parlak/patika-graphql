import { HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
const items = [
  {
    label: <Link to="/">Home</Link>,
    key: "/",
    icon: <HomeOutlined />,
  },
];
const App = () => {
  const location = useLocation();
  return (
    <Menu mode="horizontal" items={items} selectedKeys={location.pathname} className="navbar" />
  );
};
export default App;
