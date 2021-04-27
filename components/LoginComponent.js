import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import firebase from '../firebase/ConfigureFirebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: '',
            mobileNumberValid: true,
            mobileNumberInput: true,
            resendValid: true,
            otp: '',
            otpValid: true,
            otpView: false,
            otpInput: true
        };
        this.recaptchaVerifier = null;
        this.setVerificationId = null;
    }

    render() {
        return (
            <>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier => this.recaptchaVerifier = recaptchaVerifier}
                    firebaseConfig={firebase.apps.length ? firebase.app().options : undefined}
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Card title="Log In">
                        <Input
                            placeholder="1234567890"
                            onChangeText={text => this.setState({ mobileNumber: text, mobileNumberValid: true })}
                            leftIcon={{ name: 'phone' }}
                            selectionColor='tomato'
                            label="Mobile Number"
                            errorMessage={this.state.mobileNumberValid ? "" : "Invalid Mobile Number"}
                            maxLength={10}
                            disabled={!this.state.mobileNumberInput}
                            keyboardType='phone-pad'
                        />
                        {this.state.otpView ?
                            <>
                                <Input
                                    placeholder="123456"
                                    onChangeText={text => this.setState({ otp: text, otpValid: true })}
                                    selectionColor='tomato'
                                    label="OTP"
                                    leftIcon={{ name: 'vpn-key' }}
                                    disabled={!this.state.otpInput}
                                    maxLength={6}
                                    keyboardType='numeric'
                                    errorMessage={this.state.otpValid ? '' : 'Invalid OTP'}
                                />
                                <Button
                                    title="Verify & Sign In"
                                    disabled={!this.state.otpInput}
                                    onPress={() => {
                                        if (!/^\d{6}$/.test(this.state.otp)) {
                                            this.setState({ otpValid: false });
                                            return;
                                        }
                                        this.setState({ otpInput: false });
                                        this.setVerificationId.confirm(this.state.otp)
                                            .then(result => {
                                                this.setState({
                                                    mobileNumber: '',
                                                    mobileNumberValid: true,
                                                    mobileNumberInput: true,
                                                    otp: '',
                                                    otpValid: true,
                                                    otpView: false,
                                                    otpInput: true
                                                });
                                                this.setVerificationId = null;
                                            })
                                            .catch(err => {
                                                Alert.alert(
                                                    'Error',
                                                    err.message,
                                                    [{ text: 'OK' }],
                                                    { cancelable: false }
                                                );
                                                this.setState({
                                                    mobileNumber: this.state.mobileNumber,
                                                    mobileNumberValid: true,
                                                    mobileNumberInput: true,
                                                    otp: '',
                                                    otpValid: true,
                                                    otpView: false,
                                                    otpInput: true
                                                });
                                                this.setVerificationId = null;
                                            })
                                    }}
                                />
                            </>
                            :
                            <Button
                                title="Generate OTP"
                                disabled={!this.state.mobileNumberInput}
                                onPress={() => {
                                    if (!/^\d{10}$/.test(this.state.mobileNumber)) {
                                        this.setState({ mobileNumberValid: false });
                                        return;
                                    }
                                    this.setState({ mobileNumberInput: false });
                                    firebase.auth().signInWithPhoneNumber('+91' + this.state.mobileNumber, this.recaptchaVerifier)
                                        .then(confirmResult => {
                                            this.setVerificationId = confirmResult;
                                            Alert.alert(
                                                'Sent',
                                                'OTP Sent Sucessfully',
                                                [{ text: 'OK' }],
                                                { cancelable: true }
                                            );
                                            this.setState({ otpView: true });
                                        })
                                        .catch(err => {
                                            Alert.alert(
                                                'Error',
                                                err.message,
                                                [{ text: 'OK' }],
                                                { cancelable: false }
                                            );
                                            this.setState({
                                                mobileNumber: this.state.mobileNumber,
                                                mobileNumberValid: true,
                                                mobileNumberInput: true,
                                            });
                                            this.setVerificationId = null;
                                        })
                                }}
                            />
                        }
                    </Card>
                </View>
            </>
        );
    }
}

export default Login;