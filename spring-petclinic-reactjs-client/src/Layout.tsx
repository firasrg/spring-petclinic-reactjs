import { ReactNode } from "react";
import NavigationBar from "./NavigationBar";

export interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <>
    <NavigationBar />
    <div className="container-fluid">{children}</div>
  </>
);
