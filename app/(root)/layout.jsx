import Menu from "./components/Menu";

export default function WithMenuLayout({ children }) {
  return (
    <>
      <Menu />
      {children}
    </>
  );
}
