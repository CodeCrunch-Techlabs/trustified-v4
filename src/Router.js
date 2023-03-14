import { useRoutes } from "react-router-dom";
import Claim from "./components/claim/Claim";
import DashboardLayout from "./components/dashboard";
import Collections from "./components/collection/Collection";
import Landing from "./components/landing/Landing";
import LendingPageLayout from "./components/landing/LendingPageLayout";  
import CreateTemplate from "./components/template/CreateTemplate"; 
import Collectors from "./components/List/Collectors"; 
import Index from "./badge/Index";
import User from "./components/profile";
import NewTemplates from "./components/template/NewTemplates";
import DemoTemplate from "./components/template/DemoTemplate";
import Preview from "./components/template/Preview";
import BadgeTemplate from "./components/template/BadgeTemplate";

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [ 
        {
          path: "collection",
          element: <Collections />, 
        },
        {
          path:"collectors/:token",
          element: <Collectors/>
        },
        {
          path: "profile",
          element: <User />,
        },
        {
          path: "templates",
          element: <CreateTemplate />,
        }, 
        {
          path: "badge",
          element: <Index/> ,
        },
        {
          path: "temp",
          element: <NewTemplates/> ,
        },
        {
          path: "badges",
          element: <BadgeTemplate/> ,
        },
        {
          path: "test",
          element: <DemoTemplate/> ,
        },
        {
          path: "preview",
          element: <Preview/> ,
        },
      ],
    },
    {
      path: "/",
      element: <LendingPageLayout />,
      children: [{ path: "/", element: <Landing /> }],
    },
    {
      path: "/claim",
      element: <LendingPageLayout />,
      children: [{ path: "/claim/:token", element: <Claim /> }],
    },
  ]);
}
