import React, { Component } from 'react';
import { Text, View, ScrollView, Alert, ToastAndroid } from 'react-native';
import { Avatar, Card, Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { signOutUser } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    signOutUser: () => dispatch(signOutUser())
})

class Account extends Component {
    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'tomato', alignItems: 'center', paddingBottom: 5 }}>
                    {this.props.user.photoURL ?
                        <Avatar containerStyle={{ marginTop: 50, marginBottom: 5 }} size={100} rounded source={{ uri: this.props.user.photoURL }} /> :
                        <Avatar containerStyle={{ marginTop: 50, marginBottom: 5 }} size={100} rounded icon={{ name: 'account-circle', size: 100 }} />
                    }
                    {this.props.user.displayName ? <Text style={{ color: 'white', fontSize: 25, marginBottom: 25 }}>{this.props.user.displayName}</Text> : <></>}
                    {this.props.user.phoneNumber ? <Text style={{ color: 'white' }}>{this.props.user.phoneNumber}</Text> : <></>}
                    {this.props.user.email ? <Text style={{ color: 'white' }}>{this.props.user.email}</Text> : <></>}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'tomato', paddingHorizontal: 10 }}>
                    <Text></Text>
                    <Icon name='edit' color='white' size={30} onPress={() => this.props.navigation.navigate('UpdateProfile')} />
                </View>
                <Card title="My Orders" titleStyle={{ textAlign: 'left', fontSize: 16 }}><Text style={{ color: 'tomato', textAlign: 'right' }}>VIEW ALL ORDERS</Text></Card>
                <Card title="My Wishlist" titleStyle={{ textAlign: 'left', fontSize: 16 }}><Text style={{ color: 'tomato', textAlign: 'right' }} onPress={() => this.props.navigation.navigate("Drawer", { screen: 'My WishList' })}>VIEW WISHLIST</Text></Card>
                <Card title="My Reviews" containerStyle={{ marginBottom: 15 }} titleStyle={{ textAlign: 'left', fontSize: 16 }}><Text style={{ color: 'tomato', textAlign: 'right' }}>VIEW ALL REVIEWS</Text></Card>
                <ListItem title="Logout" containerStyle={{ backgroundColor: 'white', borderWidth: 0.5 }} onPress={() => this.props.signOutUser()} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);