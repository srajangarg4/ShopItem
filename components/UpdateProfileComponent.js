import React, { Component } from 'react';
import { Input, Card, Avatar, Button, ListItem } from 'react-native-elements';
import { View, ScrollView, ToastAndroid, Alert } from 'react-native';
import { connect } from 'react-redux';
import firebase from '../firebase/ConfigureFirebase';
import { updateUser } from '../redux/ActionCreators';
import { toCapitalize } from '../assets/UnderScore';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => ({
    updateUser: (obj) => dispatch(updateUser(obj))
})

class UpdateProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.user.displayName,
            email: this.props.user.email,
            emailVerified: this.props.user.emailVerified,
            displayNameValid: true,
            displayNameInput: true,
            emailValid: true,
            emailInput: true
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'tomato', alignItems: 'center' }}>
                    {this.props.user.photoURL ?
                        <Avatar containerStyle={{ marginVertical: 50 }} showAccessory size={100} rounded source={{ uri: this.props.user.photoURL }} /> :
                        <Avatar containerStyle={{ marginVertical: 50 }} showAccessory size={100} rounded icon={{ name: 'account-circle', size: 100 }} />
                    }
                </View>
                <Card>
                    <Input
                        label="Name"
                        leftIcon={{ name: 'perm-identity' }}
                        value={this.state.displayName}
                        disabled={!this.state.displayNameInput}
                        selectionColor='tomato'
                        errorMessage={this.state.displayNameValid ? "" : "Invalid Name"}
                        onChangeText={text => this.setState({ displayName: text, displayNameValid: true })}
                        placeholder="Name" />
                    <Button title="Submit" type='outline' disabled={!this.state.displayNameInput || (this.state.displayName === this.props.user.displayName && this.state.displayName.length > 0)} onPress={() => {
                        if (!(/^[a-z]+\s[a-z]+$/.test(this.state.displayName.toLowerCase()) || /^[a-z]+$/.test(this.state.displayName.toLowerCase()))) {
                            this.setState({ displayNameValid: false });
                            return;
                        }
                        this.setState({ displayNameInput: false });
                        var displayName = toCapitalize(this.state.displayName);
                        firebase.auth().currentUser.updateProfile({
                            displayName: displayName
                        })
                            .then(() => { this.props.updateUser({ displayName: displayName }); ToastAndroid.show("Profile Updated Successfully", ToastAndroid.LONG); this.props.navigation.goBack(); })
                            .catch((err) => { this.setState({ displayNameInput: true }); ToastAndroid.show('Error: ' + err.message, ToastAndroid.LONG); })
                    }} />
                </Card>
                <Card>
                    <Input disabled label='Mobile Number' leftIcon={{ name: 'phone' }} value={this.props.user.phoneNumber} />
                </Card>
                <Card containerStyle={{ marginBottom: 15 }}>
                    <Input
                        label="Email"
                        leftIcon={{ name: 'mail' }}
                        disabled={!this.state.emailInput}
                        rightIcon={this.state.emailVerified ? { name: 'verified-user', color: 'green' } : <></>}
                        value={this.state.email}
                        selectionColor='tomato'
                        onChangeText={text => {
                            text.toLowerCase() === this.props.user.email && this.props.user.emailVerified ?
                                this.setState({ email: text, emailVerified: true, emailValid: true }) :
                                this.setState({ email: text, emailVerified: false, emailValid: true })
                        }}
                        keyboardType='email-address'
                        errorMessage={this.state.emailValid ? "" : "Invalid Email Id"}
                        placeholder="Email Id" />
                    <Button title="Update" type='outline' disabled={!this.state.emailInput || (this.state.email.toLowerCase() === this.props.user.email && this.state.email.length > 0)} onPress={() => {
                        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(this.state.email)) {
                            this.setState({ emailValid: false });
                            return;
                        }
                        this.setState({ emailInput: false });
                        firebase.auth().currentUser.updateEmail(this.state.email.toLowerCase()).then(() => {
                            this.props.updateUser({ email: this.state.email.toLowerCase() });
                            ToastAndroid.show("Email Id Updated Successfully", ToastAndroid.LONG);
                        }).catch(err => {
                            this.setState({ emailInput: true });
                            if (err.code === 'auth/requires-recent-login') {
                                Alert.alert('Login Required', 'To update email id please verify your self', [{ text: 'Cancel' }, { text: 'OK', onPress: () => this.props.navigation.navigate("Login", { task: 'update_email' }) }], { cancelable: false })
                            }
                            else {
                                this.setState({ emailInput: false });
                                ToastAndroid.show("Error: " + err.message, ToastAndroid.LONG);
                            }
                        })
                    }} />
                </Card>
                <ListItem title="Change Password" containerStyle={{ backgroundColor: 'white', borderWidth: 0.5, borderBottomWidth: 0 }} />
                <ListItem title="Deactivate Account" containerStyle={{ backgroundColor: 'white', borderWidth: 0.5 }} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);