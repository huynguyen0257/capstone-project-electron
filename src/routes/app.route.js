import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { Result, Button } from "antd";
import PrivateRoute from "./private.route";
import { AppComponent, LoginComponent } from "../components";
import { logOut } from '../services';

export function AppRoute() {
    return (
        <Router>
            <Switch>
                <Route path="/login" exact>
                    <LoginComponent />
                </Route>
                <PrivateRoute path="/manager" component={AppComponent} />
                <Route path="/" exact>
                    <Redirect to="/manager" />
                </Route>
                <Route path="/no_internet_connection" exact>
                    <Result
                        status="404"
                        title="Bật Back-end lên nha"
                        subTitle=""
                        extra={<Button onClick={() => window.history.back()} type="primary">Back Home</Button>}
                    />
                </Route>
                <Route path="/invalid-role" exact>
                    <Result
                        status="404"
                        title="Your role is invalid. Please check your account"
                        subTitle=""
                        extra={<Button onClick={() => { logOut(); window.history.back() }} type="primary">Back Home</Button>}
                    />
                </Route>
            </Switch>
        </Router>
    );
}



export default AppRoute 