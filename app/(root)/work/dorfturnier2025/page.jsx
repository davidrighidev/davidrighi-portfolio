import React from "react";
import { workPages } from "../../../constants/workData";
import WorkPageComponent from "../../components/WorkPageComponent";

const data = workPages.dorfturnier2025;
export const metadata = {
  title: data.client,
};

const page = () => {
  return <WorkPageComponent data={data} />;
};

export default page;
