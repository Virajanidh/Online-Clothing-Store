import React, {Component} from "react";
import axios from "axios";
import AuthService from '../services/auth.service';
import authHeader from "../services/auth-header";
import { withRouter } from 'react-router-dom';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from "@material-ui/core/IconButton";

class AddToWishlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            objId:'',
            productId: this.props.productId,
            isInList:false,
            addToWishList: false,
            product: [],
            length: 0
        };
        this.handleWishlist = this.handleWishlist.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
            if (nextProps.productId !== null) {
                this.setState({
                    productId: nextProps.productId
                });
                if(AuthService.getUsername()){
                    axios.post("https://clothappbackend.herokuapp.com/users/getOne"+AuthService.getUsername()).then(response=>{
                        this.setState({
                            userId:response.data._id
                        }, ()=>{
                            axios.post('https://clothappbackend.herokuapp.com/wishlist/check-product' + response.data._id, null, { headers: authHeader() })
                                .then(res => {
                                    if(res.data.length>0){
                                        this.setState({
                                            product:res.data[0].ProductObject,
                                            objId:res.data._id,
                                            isInList:true,
                                            length:res.data.length
                                        });


                                        for(let i= 0 ; i<res.data[0].ProductObject.length; i++){
                                            if(res.data[0].ProductObject[i].ProductId===nextProps.productId){
                                                this.setState({
                                                    addToWishList: true,
                                                });
                                            }

                                        }

                                    }else{
                                        this.setState({
                                            isInList:false
                                        })
                                    }
                                });
                        })
                    });
                }
            }

    }
    //Checks if a user is logged in
    //If there is a wish list for the specific user, checks the list and of this is already on the list
    //It gets deleted
    //Otherwise it will be added
    handleWishlist() {
        if(AuthService.getCurrentUser() != null) {
            if (this.state.addToWishList) {
                for (let i = 0; i < this.state.product.length; i++) {
                    if (this.state.product[i].ProductId === this.state.productId) {
                        this.state.product.splice(i, 1);
                    }
                }
                axios.put('https://clothappbackend.herokuapp.com/wishlist/edit-details' + this.state.userId, this.state.product)
                    .then(() => {
                        this.setState({
                            addToWishList: false
                        });
                    })

            } else {

                if (this.state.length > 0) {
                    //User list is there
                    axios.get('https://clothappbackend.herokuapp.com/products/view-product/' + this.props.productId)
                        .then(res => {
                            const productObj = {
                                ProductId: res.data._id,
                                ProductName: res.data.ProductName,
                                Category: res.data.Category,
                                PricePerUnit: res.data.PricePerUnit,
                                SubCategory: res.data.SubCategory,
                                Discount:res.data.Discount,
                                ImageOfProduct: this.props.imagePath,
                                Quantity: this.props.quantity,
                                Color:this.props.color,
                                Size:this.props.size
                            };
                            this.state.product.push(productObj);
                            axios.put('https://clothappbackend.herokuapp.com/wishlist/edit-details' + this.state.userId, this.state.product)
                                .then(() => {
                                    this.setState({
                                        addToWishList: true
                                    });
                                });
                        });


                } else {
                    //User list is not there
                    axios.get('https://clothappbackend.herokuapp.com/products/view-product/' + this.props.productId)
                        .then(res => {
                            const productObj = {
                                ProductId: res.data._id,
                                ProductName: res.data.ProductName,
                                Category: res.data.Category,
                                PricePerUnit: res.data.PricePerUnit,
                                SubCategory: res.data.SubCategory,
                                Discount:res.data.Discount,
                                ImageOfProduct: this.props.imagePath,
                                Quantity: this.props.quantity,
                                Color:this.props.color,
                                Size:this.props.size
                            };
                            const proObj = [];
                            proObj.push(productObj);
                            const finalObj = {
                                UserId: this.state.userId,
                                ProductObject: proObj
                            };
                            axios.post('https://clothappbackend.herokuapp.com/wishlist/add-to-wishlist', finalObj)
                                .then(() => {
                                });
                            this.setState({addToWishList: true});

                        });

                }
            }
        }else {
            this.props.history.push('/loginRegView');
        }
}

    render() {
        return(
            <div>
                {this.state.addToWishList ? (
                    <IconButton>
                        <FavoriteIcon  color="secondary"  fontSize="large"  onClick={this.handleWishlist}/>
                    </IconButton>

                ):( <IconButton>
                        <FavoriteBorderIcon fontSize="large"  onClick={this.handleWishlist} />
                    </IconButton>
                    )}
            </div>

        );
    }
}
export default withRouter(AddToWishlist);