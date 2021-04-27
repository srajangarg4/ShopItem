import React, { Component } from 'react';
import { View, FlatList, Text, SafeAreaView } from 'react-native';
import { ListItem, Avatar, Badge, Icon, Card, Button } from 'react-native-elements';
import { fetchProducts } from '../redux/ActionCreators';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { shuffle } from '../assets/UnderScore';

const mapStateToProps = state => {
    return {
        products: state.products,
        categories: state.categories
    }
}

const mapDispatchToProps = dispatch => ({
    fetchProducts: () => dispatch(fetchProducts("Products"))
})

class ProductList extends Component {

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
                <Card key={index} containerStyle={{ margin: 0, padding: 0, borderWidth: 0.5 }}>
                    <ListItem
                        containerStyle={{ paddingRight: 0 }}
                        title={item.name.slice(0, item.name.lastIndexOf('(') - 1)}
                        leftElement={<Avatar source={{ uri: item.image[0] }} avatarStyle={{ resizeMode: 'contain' }} activeOpacity={0.7} height={150} size='large' />}
                        subtitle={<View>
                            <Text style={{ fontFamily: 'sans-serif', backgroundColor: 'transparent', color: 'rgba(0,0,0,0.54)', fontSize: 14 }}>{item.name.slice(item.name.lastIndexOf('(') + 1, item.name.length - 1)}</Text>
                            <Badge status='success' badgeStyle={{ alignSelf: 'flex-start' }} value={<View style={{ alignContent: 'center', flexDirection: 'row' }}><Icon name="star" iconStyle={{ textAlignVertical: 'center', marginLeft: 6 }} color='white' size={16} type="font-awesome"></Icon><Text style={{ textAlignVertical: 'center', color: 'white', paddingHorizontal: 8 }}>{item.rating}</Text></View>} />
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{'\u20B9'}{priceFormat(item.price)}</Text>
                        </View>}
                        onPress={() => this.props.navigation.navigate('Product', { productId: item.id })}
                        rightIcon={<Icon raised reverse containerStyle={{ margin: 0, marginRight: 4, alignSelf: 'flex-start' }} size={16} iconStyle={{ margin: 0 }} name='heart-o' type='font-awesome' color='#f50' />}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
                        {item.highlights.map((highlight, key) => <Button key={key} titleStyle={{ fontSize: 11 }} buttonStyle={{ margin: 2 }} title={highlight} type='outline' disabled />)}
                    </View>
                </Card>
            );
        }

        if (this.props.products.isLoading) {
            return (<Loading />);
        }
        else if (this.props.products.errMess) {
            return (
                <View>
                    <Text>{this.props.products.errMess}</Text>
                </View>
            );
        }
        else {
            return (
                <SafeAreaView>
                    <FlatList
                        data={shuffle(this.props.products.products)}
                        renderItem={renderProductItem}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
            );
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);