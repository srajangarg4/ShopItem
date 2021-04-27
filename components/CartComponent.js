import React, { Component } from 'react';
import { View, Text, FlatList, Picker, Dimensions, ActivityIndicator, ToastAndroid } from 'react-native';
import { Card, Button, ListItem, Avatar } from 'react-native-elements';
import { removeProductFromCart, updateProductInCart } from '../redux/ActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        products: state.products,
        cart: state.cart
    }
}

const mapDispatchToProps = dispatch => ({
    removeProductFromCart: (productId) => dispatch(removeProductFromCart(productId)),
    updateProductInCart: (arr) => dispatch(updateProductInCart(arr))
})

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flatList: null
        }
    }

    render() {

        const priceFormat = (value) => {
            if (value <= 99999)
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            else {
                value = value.toString()
                return value.slice(0, value.toString().length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + value.slice(value.toString().length - 3)
            }
        }

        const renderCartProduct = ({ item, index }) => {

            class CartItem extends Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        buttonPressRemove: false,
                        enablePicker: true
                    }
                }
                render() {
                    return (
                        <Card key={index} containerStyle={{ margin: 0, padding: 0, marginVertical: 20 }}>
                            <ListItem
                                title={item.product.name.slice(0, item.product.name.lastIndexOf('(') - 1)}
                                titleProps={{ onPress: () => this.props.parentProps.navigation.navigate('Product', { productId: item.id }) }}
                                titleStyle={{ marginBottom: 5 }}
                                subtitle={<View>
                                    <Text style={{ marginBottom: 5, fontFamily: 'sans-serif', backgroundColor: 'transparent', color: 'rgba(0,0,0,0.54)', fontSize: 14 }}>{item.product.name.slice(item.product.name.lastIndexOf('(') + 1, item.product.name.length - 1)}</Text>
                                    <Text style={{ marginBottom: 5, fontWeight: 'bold', fontSize: 20 }}>{'\u20B9'}{priceFormat(item.product.price * item.quantity)}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ alignSelf: 'center', color: 'tomato', fontSize: 18, fontWeight: 'bold' }}>Quantity:</Text>
                                        <View style={{ borderColor: 'tomato', borderWidth: 0.4, scaleY: 0.8, scaleX: 0.9, width: 75, height: 50 }}>
                                            {this.state.enablePicker ?
                                                <Picker selectedValue={item.quantity} onValueChange={(itemValue, itemIndex) => {
                                                    this.setState({ enablePicker: false });
                                                    var temp = Object.assign([], this.props.parentProps.cart.cart);
                                                    temp[temp.indexOf(temp.filter(product => product.id === item.id)[0])].quantity = itemValue;
                                                    this.props.parentProps.updateProductInCart(temp);
                                                }}>
                                                    <Picker.Item label='1' value={1} />
                                                    <Picker.Item label='2' value={2} />
                                                    <Picker.Item label='3' value={3} />
                                                </Picker> :
                                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                                    <ActivityIndicator size="small" color="#fd5437" />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>}
                                rightElement={<Avatar source={{ uri: item.product.image[0] }} avatarStyle={{ resizeMode: 'contain' }} activeOpacity={0.7} height={150} size='medium' />}
                            />
                            <Button title="Remove" containerStyle={{ marginHorizontal: 10, marginBottom: 10 }} loading={this.state.buttonPressRemove} type='outline' icon={{ name: 'delete', color: '#fd5437' }} onPress={() => {
                                this.setState({ buttonPressRemove: true, enablePicker: false });
                                this.props.parentProps.removeProductFromCart(item);
                            }} />
                        </Card>
                    );
                }
            }
            return (<CartItem parentProps={this.props} />);
        }

        if (this.props.products.errMess) {
            return (
                <View>
                    <Text>{this.props.products.errMess}</Text>
                </View>
            );
        }
        else {
            if (this.props.cart.cart.length === 0) {
                return (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Card
                            image={require('../assets/empty-cart.jpg')}
                            imageStyle={{ resizeMode: 'contain' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Opps! Your cart is empty!</Text>
                                <Text></Text>
                                <Text style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent', color: 'rgba(0,0,0,0.54)', fontSize: 14 }}>Add items to it now.</Text>
                                <Text></Text>
                            </View>
                            <Button title="Go Back" onPress={() => this.props.navigation.goBack()} />
                        </Card>
                    </View>
                );
            }
            else {
                const totalPrice = () => {
                    var i, sum = 0;
                    for (i = 0; i < this.props.cart.cart.length; i++) {
                        sum += this.props.cart.cart[i].product.price * this.props.cart.cart[i].quantity
                    }
                    return (sum);
                }
                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View>
                            <FlatList
                                ref={(ref) => this.state.flatList = ref}
                                data={this.props.cart.cart}
                                keyExtractor={item => item.id}
                                renderItem={renderCartProduct}
                                ListFooterComponent={
                                    <Card
                                        title="PRICE DETAILS"
                                        containerStyle={{ margin: 0, marginTop: 20, marginBottom: 93 }}
                                        titleStyle={{ textAlign: 'left' }}>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Price ({this.props.cart.cart.length} {this.props.cart.cart.length === 1 ? 'item' : 'items'})</Text>
                                            <Text>{'\u20B9'}{priceFormat(totalPrice())}</Text>
                                        </View>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Delivery Fee</Text>
                                            {totalPrice() > 500 ? <Text style={{ color: 'green', fontWeight: 'bold' }}>FREE</Text> : <Text>{'\u20B9'}40</Text>}
                                        </View>
                                        <View style={{ marginVertical: 10, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.3, borderStyle: 'dotted' }}>
                                            <Text style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 16 }}>Total Price</Text>
                                            <Text style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 16 }}>{'\u20B9'}{totalPrice() > 500 ? priceFormat(totalPrice()) : priceFormat(totalPrice() + 40)}</Text>
                                        </View>
                                    </Card>
                                } />
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: 'white', position: 'absolute', bottom: 0, borderTopWidth: 0.2, borderColor: 'tomato' }}>
                            <View style={{ width: Dimensions.get('window').width * 0.45, padding: 10 }}>
                                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{'\u20B9'}{priceFormat(totalPrice())}</Text>
                                <Text style={{ color: 'royalblue' }} onPress={() => this.state.flatList.scrollToEnd({ animated: true })}>View price details</Text>
                            </View>
                            <View style={{ width: Dimensions.get('window').width * 0.55, padding: 10, justifyContent: 'center' }}>
                                <Button title="Buy Now" />
                            </View>
                        </View>
                    </View>
                );
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);