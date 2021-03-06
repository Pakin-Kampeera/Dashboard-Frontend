import React, {useState, useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import {PageLoading} from '../../components/index';
import {toast} from 'react-toastify';
import {useDispatch} from 'react-redux';
import {dashboardAction} from '../../store/reducer/dashboardReduce';
import {authAction} from '../../store/reducer/authReducer';
import Dashboard from '../Dashboard';
import Header from './header/Header';
import Footer from './footer/Footer';
import Users from '../Users';
import MenuSidebar from './menu-sidebar/MenuSidebar';
import axios from '../../utils/axios';
import AdminRoute from '../../routes/AdminRoute';

const Main = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [menusidebarState, updateMenusidebarState] = useState({
        isMenuSidebarCollapsed: false
    });
    const dispatch = useDispatch();

    const toggleMenuSidebar = () => {
        updateMenusidebarState({
            isMenuSidebarCollapsed: !menusidebarState.isMenuSidebarCollapsed
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const {data} = await axios.get('/api/data', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                dispatch(dashboardAction.setWidget(data.total));
                if (data.wordClouds) {
                    dispatch(dashboardAction.setWordCloud(data.wordClouds));
                }
                if (data.history) {
                    dispatch(dashboardAction.setTable(data.history.reverse()));
                }
                console.log(data.average);
                if (data.average) {
                    dispatch(dashboardAction.setAverage(data.average));
                }
                dispatch(
                    authAction.login({
                        username: data.user.username,
                        email: data.user.email,
                        role: data.user.role,
                        createdAt: new Date(
                            data.user.createdAt
                        ).toLocaleDateString()
                    })
                );
                setIsLoading(false);
            } catch (error) {
                toast.error(
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        'Failed',
                    {theme: 'colored'}
                );
                dispatch(authAction.logout());
            }
        };
        fetchData();
    }, [dispatch]);

    document.getElementById('root').classList.remove('register-page');
    document.getElementById('root').classList.remove('login-page');
    document.getElementById('root').classList.remove('hold-transition');

    document.getElementById('root').className += ' sidebar-mini';

    if (menusidebarState.isMenuSidebarCollapsed) {
        document.getElementById('root').classList.add('sidebar-collapse');
        document.getElementById('root').classList.remove('sidebar-open');
    } else {
        document.getElementById('root').classList.add('sidebar-open');
        document.getElementById('root').classList.remove('sidebar-collapse');
    }

    let template;

    if (isLoading) {
        template = <PageLoading />;
    } else {
        template = (
            <>
                <Header toggleMenuSidebar={toggleMenuSidebar} />
                <MenuSidebar />
                <div className="content-wrapper">
                    <div className="pt-3" />
                    <section className="content">
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <AdminRoute exact path="/users">
                                <Users />
                            </AdminRoute>
                        </Switch>
                    </section>
                </div>
                <Footer />
                <div
                    id="sidebar-overlay"
                    role="presentation"
                    onClick={toggleMenuSidebar}
                />
            </>
        );
    }

    return <div className="wrapper">{template}</div>;
};

export default Main;
