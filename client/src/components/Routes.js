import React, {useContext} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import Profile from "./Profile";
import Auth from "./Auth";
import Header from "./Header";
import Footer from "./Footer";
import AuthFooter from "./AuthFooter";
import NavigationBar from "./NavigationBar";
import Students from "./Students";
import Tests from "./Tests";
import TestPage from "./TestPage";
import {AuthContext} from "./context/AuthContext";
import AddTest from "./AddTest";

import './appearence/css/index.css'
import './appearence/css/Auth.css'
import ProfileViewForStudents from "./ProfileViewForStudents";
import EditTest from "./EditTest";
import ResultPage from "./ResultPage";

export const useRouts = (isAuthenticated, type, username) => {

    const auth = useContext(AuthContext)
    if (isAuthenticated){
        if (type === 'p'){
            return (
                <Switch>
                    <Route path = '/profile/:id' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <Profile/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Route path = '/students' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <Students/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Route path = '/tests' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <Tests/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Route path = '/tests/:id' className = 'greenPage' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <TestPage/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Route path = '/addtest' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <AddTest/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>


                    <Route path = '/tests/:link/edit' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <EditTest/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Route path = '/tests/:link/:id' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <ResultPage/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Redirect to = '/tests'/>
                </Switch>
            )
        }
        else if (type === 's') {
            return (
                <Switch>
                    <Route path = '/profile/:id' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <ProfileViewForStudents/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Route path = '/tests' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <Tests/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Route path = '/tests/:id' className = 'greenPage' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <TestPage/>
                            </div>
                        </div>
                    </Route>

                    <Route path = '/tests/:link/:id' exact>
                        <div className = 'page'>
                            <Header/>
                            <NavigationBar/>
                            <div className='pageContent'>
                                <ResultPage/>
                            </div>
                            <Footer/>
                        </div>
                    </Route>

                    <Redirect to = '/tests'/>
                </Switch>
            )
        }
    }
    else {
        return (
            <Switch>
                <Route path = '/' exact>
                    <Auth/>
                    <AuthFooter/>
                </Route>

                <Redirect to = '/'/>
            </Switch>
        )
    }
}