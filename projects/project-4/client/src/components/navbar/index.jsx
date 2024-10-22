import { Menu } from "antd";
import { HomeOutlined, PlusSquareOutlined } from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const items = [
    {
      label: <Link to={"/"}>Home</Link>,
      key: "/",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to={"/questions/new"}>New Question</Link>,
      key: "/questions/new",
      icon: <PlusSquareOutlined />,
    },
  ];
  const location = useLocation();
  return (
    <nav>
      <Menu selectedKeys={location.pathname} mode="horizontal" items={items} />
    </nav>
  );
}
