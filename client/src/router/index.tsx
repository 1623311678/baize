import React, { Fragment, Suspense, lazy } from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom"
const Home = lazy(() =>
  import(/* webpackChunkName: "Home" */ "@src/pages/Home")
)
const NotFound = lazy(() =>
  import(/* webpackChunkName: "404" */ "@src/pages/404")
)
const About = lazy(() =>
  import(/* webpackChunkName: "About" */ "@src/pages/About")
)
const Users = lazy(() =>
  import(/* webpackChunkName: "Users" */ "@src/pages/Users")
)
const Users1 = lazy(() =>
  import(/* webpackChunkName: "Users1" */ "@src/pages/Users1")
)
const Users2 = lazy(() =>
  import(/* webpackChunkName: "Users2" */ "@src/pages/Users2")
)

const JsErrorPage = lazy(() =>
  import(/* webpackChunkName: "JsErrorPage" */ "@src/pages/jsError")
)
const ActionsPage = lazy(() =>
  import(/* webpackChunkName: "ActionPage" */ "@src/pages/Actions")
)
const PvPage = lazy(() =>
  import(/* webpackChunkName: "PvPage" */ "@src/pages/pv")
)
const UvPage = lazy(() =>
  import(/* webpackChunkName: "UvPage" */ "@src/pages/UV")
)

const routes = [
  { path: "/", component: Home },
  { path: "/404", component: NotFound },
  { path: "/about", component: About },
  { path: "/users", component: Users },
  { path: "/users/app1", component: Users1 },
  { path: "/users/app2", component: Users2 },
  { path: "/js-error", component: JsErrorPage },
  { path: "/actions", component: ActionsPage },
  { path: "/pv", component: PvPage },
  { path: "/uv", component: UvPage },
]
function AppRouter() {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.map((item, index) => (
            <Route
              path={item.path}
              component={item.component}
              key={index}
              exact
            />
          ))}
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Suspense>
    </Fragment>
  )
}

export default AppRouter
