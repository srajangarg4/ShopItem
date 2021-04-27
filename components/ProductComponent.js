import React, { Component } from 'react';
import { Card, Button, Badge, Icon } from 'react-native-elements';
import { View, Text, ScrollView, FlatList, Dimensions, ActivityIndicator, ToastAndroid } from 'react-native';
import { addProductToCart } from '../redux/ActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        products: state.products,
        cart: state.cart
    }
}

const mapDispatchToProps = dispatch => ({
    addProductToCart: (obj) => dispatch(addProductToCart(obj))
})

class Product extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonPressAddToCart: false
        }
    }

    render() {

        const item = this.props.products.products.filter((product) => product.id === this.props.route.params.productId)[0]

        const priceFormat = (value) => {
            if (value <= 99999)
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            else {
                value = value.toString()
                return value.slice(0, value.toString().length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + value.slice(value.toString().length - 3)
            }

        }

        return (
            <ScrollView>
                <FlatList
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator
                    data={item.image}
                    style={{ height: '100%', width: Dimensions.get('window').width }}
                    renderItem={({ item, index }) => {
                        return (
                            <Card
                                containerStyle={{ margin: 0, borderWidth: 0, width: Dimensions.get('window').width }}
                                key={index}
                                image={{ uri: item }}
                                imageProps={{ PlaceholderContent: <ActivityIndicator size='large' color='#fd5437' /> }}
                                imageStyle={{ margin: 10, resizeMode: 'contain', height: Dimensions.get('window').height * 0.45 }} />
                        );
                    }}
                    keyExtractor={(key) => item.image.indexOf(key).toString()} />
                <Card
                    containerStyle={{ margin: 0, borderWidth: 0 }}>
                    <View>
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        <Badge
                            status='success'
                            badgeStyle={{ height: 25, alignSelf: 'flex-start' }}
                            value={
                                <View style={{ alignContent: 'center', flexDirection: 'row' }}>
                                    <Icon name="star" iconStyle={{ justifyContent: 'center', marginLeft: 6 }} color='white' size={17} type="font-awesome" />
                                    <Text style={{ justifyContent: 'center', color: 'white', paddingHorizontal: 6 }}>{item.rating}</Text>
                                </View>} />
                        <Text style={{ fontWeight: 'bold', fontSize: 25 }}>{'\u20B9'} {priceFormat(item.price)}</Text>
                    </View>
                </Card>
                <Card containerStyle={{ margin: 0 }}>
                    {this.props.cart.cart.some(el => el.id === item.id) ?
                        <Button title="Go to Cart" onPress={() => { this.props.navigation.navigate("Drawer", { screen: 'My Cart' }) }} type="outline" /> :
                        <Button title="Add to Cart" loading={this.state.buttonPressAddToCart} type="outline" onPress={() => {
                            this.setState({ buttonPressAddToCart: true });
                            this.props.addProductToCart({ id: item.id, product: item, quantity: 1 });
                        }} />
                    }
                </Card>
                <Card
                    title="Highlights"
                    titleStyle={{ textAlign: 'left' }}>
                    <View>
                        {
                            item.highlights.map((highlight, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 20, marginEnd: 5 }}>{'\u2022'}</Text>
                                        <Text style={{ textAlignVertical: 'center' }}>{highlight}</Text>
                                    </View>
                                );
                            })
                        }
                    </View>
                </Card>
                <Card title={
                    <View style={{ flexDirection: 'row', marginRight: 0, justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'sans-serif', fontSize: 14, textAlignVertical: 'center', color: '#43484d', fontWeight: 'bold' }}>Ratings & Reviews</Text>
                        <Button title="Rate Product" titleStyle={{ paddingTop: 0, paddingBottom: 0 }} type='outline' buttonStyle={{ scaleX: 0.9, scaleY: 0.8 }} />
                    </View>
                }>
                </Card>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);