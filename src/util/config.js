import App from "../components/App";
import Passport from "../components/passport";
import Profile from "../components/passport/Profile";
import Item from "../components/item";
import Detail from "../components/item/Detail";
import Register from "../components/passport/Register";

export const menu = [
  {
    path: "/",
    title: "Index",
  },
  {
    path: "/profile",
    title: "Profile",
  },
  {
    path: "/item",
    title: "Items",
  }
];

export const routes = [{
    path: "/register",
    component: Register,
    isPublic: true
},{
    path: "/login",
    component: Passport,
    isPublic: true
},{
    path: "/item/:id",
    component: Detail
},{
    path: "/item",
    component: Item
},{
    path: "/profile",
    component: Profile
},{
    path: "/",
    component: App,
    isPublic: true
}];