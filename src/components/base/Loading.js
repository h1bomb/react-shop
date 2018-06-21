import React from "react";
import {Spin, message } from "antd";

const Loading = ({ loading, error }) => (
  <div>
    {loading && <Spin />}
    {error && message.error(":( Please try again")}
  </div>
);

export default Loading;
