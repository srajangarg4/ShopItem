import React, { Component } from 'react';
import { View, FlatList, Text, SafeAreaView, ToastAndroid, ActivityIndicator } from 'react-native';
import { ListItem, Avatar, Badge, Icon, Card, Button } from 'react-native-elements';
import { fetchProducts, removeProductFromWishlist, addProductToWishlist } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import firebase from '../firebase/ConfigureFirebase';

const mapStateToProps = state => {
    return {
        products: state.products,
        categories: state.categories,
        wishlist: state.wishlist
    }
}

const mapDispatchToProps = dispatch => ({
    fetchProducts: () => dispatch(fetchProducts("Home")),
    removeProductFromWishlist: (productId) => dispatch(removeProductFromWishlist(productId)),
    addProductToWishlist: (obj) => dispatch(addProductToWishlist(obj))
})

class Home extends Component {

    componentDidMount() {
        this.props.fetchProducts();
    }

    render() {

        const renderProductItem = ({ item, index }) => {

            const priceFormat = (value) => {
                if (value <= 99999)
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                else {
                    value = value.toString()
                    return value.slice(0, value.toString().length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + value.slice(value.toString().length - 3)
                }
            }

            return (
                <ListItem
                    key={index}
                    containerStyle={{ paddingRight: 0 }}
                    title={item.name.slice(0, item.name.lastIndexOf('(') - 1)}
                    leftElement={<Avatar source={{ uri: item.image[0] }} imageProps={{ PlaceholderContent: <ActivityIndicator size='large' color='#fd5437' /> }} avatarStyle={{ resizeMode: 'contain' }} activeOpacity={0.7} height={150} size='large' />}
                    subtitle={<View>
                        <Text style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent', color: 'rgba(0,0,0,0.54)', fontSize: 14 }}>{item.name.slice(item.name.lastIndexOf('(') + 1, item.name.length - 1)}</Text>
                        <Badge status='success' badgeStyle={{ alignSelf: 'flex-start' }} value={<View style={{ alignContent: 'center', flexDirection: 'row' }}><Icon name="star" iconStyle={{ textAlignVertical: 'center', marginLeft: 6 }} color='white' size={16} type="font-awesome"></Icon><Text style={{ textAlignVertical: 'center', color: 'white', paddingHorizontal: 8 }}>{item.rating}</Text></View>} />
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{'\u20B9'}{priceFormat(item.price)}</Text>
                    </View>}
                    bottomDivider
                    onPress={() => this.props.navigation.navigate('Product', { productId: item.id })}
                    rightIcon={<RightIcon parentProps={this.props} item={item} selected={this.props.wishlist.wishlist.some(product => product.id === item.id)} />}
                />
            );
        }

        if (this.props.products.isLoading || this.props.categories.isLoading) {
            return (
                <Loading />
            );
        }
        else if (this.props.products.errMess || this.props.categories.errmess) {
            if (this.props.products.errMess)
                return (
                    <View>
                        <Text>{this.props.products.errMess}</Text>
                    </View>
                );
            else
                return (
                    <View>
                        <Text>{this.props.categories.errMess}</Text>
                    </View>
                );
        }
        else {
            return (
                <FlatList
                    data={this.props.categories.categories}
                    keyExtractor={category => category.id}
                    renderItem={({ item, index }) =>
                        <Card
                            key={index}
                            title={item.name}>
                            <FlatList
                                data={this.props.products.products.filter((product) => product.featured === true && product.category === item.name)}
                                renderItem={renderProductItem}
                                keyExtractor={item => item.id}
                            />
                        </Card>
                    } />
            );
        }
    }
}

class RightIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    render() {

        return (/*
            <Button
                containerStyle={{ margin: 0, alignSelf: 'flex-start' }}
                raised type='outline'
                icon={{ name: this.props.selected ? 'favorite' : 'favorite_border', color: '#f50', size: 16 }}
                iconContainerStyle={{ margin: 0 }}
                loading={this.state.loading}
                onPress={() => {
                    if (firebase.auth().currentUser) {
                        this.setState({ loading: true });
                        console.log(this.state);
                        if (this.props.selected) {
                            firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber)
                                .update({ wishlist: firebase.firestore.FieldValue.arrayRemove({ id: this.props.item.id, product: this.props.item }) })
                                .then(() => this.props.parentProps.removeProductFromWishlist(this.props.item.id))
                                .catch(err => ToastAndroid.show('Error: ' + err.message, ToastAndroid.LONG))
                        }
                        else {
                            firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber)
                                .update({ wishlist: firebase.firestore.FieldValue.arrayUnion({ id: this.props.item.id, product: this.props.item }) })
                                .then(() => this.props.parentProps.addProductToWishlist({ id: this.props.item.id, product: this.props.item }))
                                .catch(err => ToastAndroid.show(err.message, ToastAndroid.LONG))
                        }
                        this.setState({ loading: false });
                    }
                    else {
                        this.props.parentProps.navigation.navigate('Login');
                    }
                }
                }
            />*/
            <>{this.state.loading ? <View style={{ elevation: 1, backgroundColor: '#fff', margin: 0, alignSelf: 'flex-start' }}><ActivityIndicator size='small' color="red" /></View> :
                <Icon raised reverse
                    containerStyle={{ margin: 0, marginRight: 4, alignSelf: 'flex-start' }}
                    size={16} iconStyle={{ margin: 0 }}
                    name={this.props.selected ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
                    onPress={() => {
                        if (firebase.auth().currentUser) {
                            this.setState({ loading: true });
                            console.log(this.state);
                            if (this.props.selected) {
                                firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber)
                                    .update({ wishlist: firebase.firestore.FieldValue.arrayRemove({ id: this.props.item.id, product: this.props.item }) })
                                    .then(() => this.props.parentProps.removeProductFromWishlist(this.props.item.id))
                                    .catch(err => ToastAndroid.show('Error: ' + err.message, ToastAndroid.LONG))
                            }
                            else {
                                firebase.firestore().collection('Users').doc(firebase.auth().currentUser.phoneNumber)
                                    .update({ wishlist: firebase.firestore.FieldValue.arrayUnion({ id: this.props.item.id, product: this.props.item }) })
                                    .then(() => this.props.parentProps.addProductToWishlist({ id: this.props.item.id, product: this.props.item }))
                                    .catch(err => ToastAndroid.show(err.message, ToastAndroid.LONG))
                            }
                            this.setState({ loading: false });
                        }
                        else {
                            this.props.parentProps.navigation.navigate('Login');
                        }
                    }} />}</>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);