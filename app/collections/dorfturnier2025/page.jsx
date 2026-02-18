import CollectionsComponent from "../CollectionsComponent";
import data from "./data.json";
export const metadata = {
  title: data.title,
};

export default function Page() {
  return <CollectionsComponent data={data} />;
}
