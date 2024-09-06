import { Spin } from "antd";

export default function index() {
  return (
    <div className="loadingContainer">
      <Spin size="large" />
    </div>
  );
}
