import React, { Component } from 'react';
import ProductList from './ProductListComponent';
import { connect } from 'react-redux';
import { fetchCategories, fetchUser } from '../redux/ActionCreators';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Product from './ProductComponent';
import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import Cart from './CartComponent';
import Login from './LoginComponent';
import Home from './HomeComponent';
import Wishlist from './WishlistComponent';
import UpdateProfile from './UpdateProfileComponent';
import Account from './AccountComponent';

const mapStateToProps = state => {
    return {
        categories: state.categories,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    fetchCategories: () => dispatch(fetchCategories()),
    fetchUser: () => dispatch(fetchUser())
})

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const headerLeftContent = (navigation) => <Icon
    containerStyle={{ marginHorizontal: 11, marginVertical: 3, flexDirection: 'row', alignItems: 'center' }}
    iconStyle={{ overflow: 'hidden', margin: 3, transform: [{ scaleX: 1 }] }}
    color='white'
    onPress={() => navigation.goBack()}
    name='arrow-back' />

const headerRightContent = (navigation) => <View style={{ flexDirection: 'row' }}>
    <Icon color='white' iconStyle={{ marginEnd: 10 }} name='notifications' />
    <Icon color='white' iconStyle={{ marginEnd: 10 }} name='shopping-cart' onPress={() => { navigation.navigate("Drawer", { screen: 'My Cart' }) }} />
</View>

class Main extends Component {

    componentDidMount() {
        this.props.fetchCategories();
        this.props.fetchUser();
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Drawer" options={{ headerShown: false }}>
                        {props => {
                            return (
                                <Drawer.Navigator {...props}>
                                    <Drawer.Screen name="Home" >
                                        {props => {
                                            return (
                                                <Stack.Navigator {...props} headerMode="screen" screenOptions={{ headerTintColor: 'white', headerRight: () => headerRightContent(props.navigation), headerStyle: { backgroundColor: 'tomato' } }}>
                                                    <Stack.Screen name="Home" component={Home} />
                                                </Stack.Navigator>
                                            );
                                        }}
                                    </Drawer.Screen>
                                    <Drawer.Screen name="All Products" >
                                        {props => {
                                            return (
                                                <Stack.Navigator {...props} headerMode="screen" screenOptions={{ headerLeft: () => headerLeftContent(props.navigation), headerTintColor: 'white', headerRight: () => headerRightContent(props.navigation), headerStyle: { backgroundColor: 'tomato' } }}>
                                                    <Stack.Screen name="All Products" component={ProductList} />
                                                </Stack.Navigator>
                                            );
                                        }}
                                    </Drawer.Screen>
                                    <Drawer.Screen name="My Cart">
                                        {props => {
                                            return (
                                                <Stack.Navigator {...props} headerMode="screen" screenOptions={{ headerLeft: () => headerLeftContent(props.navigation), headerTintColor: 'white', headerRight: () => headerRightContent(props.navigation), headerStyle: { backgroundColor: 'tomato' } }}>
                                                    <Stack.Screen name="Cart" component={Cart} />
                                                </Stack.Navigator>
                                            );
                                        }}
                                    </Drawer.Screen>
                                    <Drawer.Screen name="My WishList" >
                                        {props => {
                                            return (
                                                <Stack.Navigator {...props} headerMode="screen" screenOptions={{ headerLeft: () => headerLeftContent(props.navigation), headerTintColor: 'white', headerRight: () => this.props.user ? headerRightContent(props.navigation) : '', headerStyle: { backgroundColor: 'tomato' } }}>
                                                    <Stack.Screen name="My Wishlist" options={{ title: this.props.user ? 'My Wishlist' : 'Login' }} component={this.props.user ? Wishlist : Login} />
                                                </Stack.Navigator>
                                            );
                                        }}
                                    </Drawer.Screen>
                                    <Drawer.Screen name="My Account" >
                                        {props => {
                                            return (
                                                <Stack.Navigator {...props} headerMode="screen" screenOptions={{ headerLeft: () => headerLeftContent(props.navigation), headerTintColor: 'white', headerRight: () => this.props.user ? headerRightContent(props.navigation) : '', headerStyle: { backgroundColor: 'tomato' } }}>
                                                    <Stack.Screen name="My Account" options={{ title: this.props.user ? 'My Account' : 'Login' }} component={this.props.user ? Account : Login} />
                                                </Stack.Navigator>
                                            );
                                        }}
                                    </Drawer.Screen>
                                </Drawer.Navigator>
                            );
                        }}
                    </Stack.Screen>
                    <Stack.Screen name="Product" component={Product} options={({ navigation, route }) => ({ title: '', headerTintColor: 'white', headerRight: () => headerRightContent(navigation), headerStyle: { backgroundColor: 'tomato' } })} />
                    <Stack.Screen name="Login" component={Login} options={({ navigation, route }) => ({ title: route.params.task === 'update_email' ? 'Update Email ID' : 'Login', headerTintColor: 'white', headerStyle: { backgroundColor: 'tomato' } })} />
                    <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={({ navigation, route }) => ({ title: 'Update Profile', headerTintColor: 'white', headerStyle: { backgroundColor: 'tomato' } })} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);