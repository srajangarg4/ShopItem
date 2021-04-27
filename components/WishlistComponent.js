import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, SafeAreaView, FlatList } from 'react-native';
import { ListItem, Card, Icon, Badge, Avatar, Button } from 'react-native-elements';

const mapStateToProps = state => {
    return {
        wishlist: state.wishlist
    }
}

class Wishlist extends Component {

    render() {

        const renderWishlistItem = ({ item, index }) => {
            const priceFormat = (value) => {
                if (value <= 99999)
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                else {
                    value = value.toString()
                    return value.slice(0, value.toString().length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + value.slice(value.toString().length - 3)
                }
            }

            return (
                <Card key={index} containerStyle={{ margin: 0, padding: 0, borderWidth: 0.5 }}>
                    <ListItem
                        containerStyle={{ paddingRight: 0 }}
                        title={item.product.name.slice(0, item.product.name.lastIndexOf('(') - 1)}
                        leftElement={<Avatar source={{ uri: item.product.image[0] }} avatarStyle={{ resizeMode: 'contain' }} activeOpacity={0.7} height={150} size='large' />}
                        subtitle={<View>
                            <Text style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent', color: 'rgba(0,0,0,0.54)', fontSize: 14 }}>{item.product.name.slice(item.product.name.lastIndexOf('(') + 1, item.product.name.length - 1)}</Text>
                            <Badge status='success' badgeStyle={{ alignSelf: 'flex-start' }} value={<View style={{ alignContent: 'center', flexDirection: 'row' }}><Icon name="star" iconStyle={{ textAlignVertical: 'center', marginLeft: 6 }} color='white' size={16} type="font-awesome"></Icon><Text style={{ textAlignVertical: 'center', color: 'white', paddingHorizontal: 8 }}>{item.product.rating}</Text></View>} />
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{'\u20B9'}{priceFormat(item.product.price)}</Text>
                        </View>}
                        onPress={() => this.props.navigation.navigate('Product', { productId: item.id })}
                        rightIcon={<Icon raised reverse containerStyle={{ margin: 0, marginRight: 4, alignSelf: 'flex-start' }} size={16} iconStyle={{ margin: 0 }} name='heart-o' type='font-awesome' color='#f50' />}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
                        {item.product.highlights.map((highlight, key) => <Button key={key} titleStyle={{ fontSize: 11 }} buttonStyle={{ margin: 2 }} title={highlight} type='outline' disabled />)}
                    </View>
                </Card>
            );
        }

        if (this.props.wishlist.errMess) {
            return (
                <View>
                    <Text>{this.props.wishlist.errMess}</Text>
                </View>
            );
        }
        else {
            if (this.props.wishlist.wishlist.length === 0) {
                return (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Card
                            image={require('../assets/empty-cart.jpg')}
                            imageStyle={{ resizeMode: 'contain' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Opps! Your wishlist is empty!</Text>
                                <Text></Text>
                                <Text style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent', color: 'rgba(0,0,0,0.54)', fontSize: 14 }}>Add items to it now.</Text>
                                <Text></Text>
                            </View>
                            <Button title="Add Items" onPress={() => this.props.navigation.navigate('Drawer', { screen: 'All Products' })} />
                        </Card>
                    </View>
                );
            }
            else {
                return (
                    <FlatList
                        data={this.props.wishlist.wishlist}
                        renderItem={renderWishlistItem}
                        keyExtractor={item => item.id}
                    />
                );
            }
        }
    }
}

export default connect(mapStateToProps)(Wishlist);