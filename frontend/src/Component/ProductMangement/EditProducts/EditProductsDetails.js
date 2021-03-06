import React, {Component} from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormLabel from "react-bootstrap/FormLabel";
import FormControl from "react-bootstrap/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import axios from "axios";
import Button from "@material-ui/core/Button";
import LoaderComponent from "../ViewProducts/LoaderComponent";


class EditProductsDetails extends Component{

    constructor() {
        super();
        this.state = {
            Products: {
                ProductName:'',
                ProductBrand:'',
                Category: '',
                PricePerUnit: '',
                SubCategory:'',
                Discount: '',
            },
            CategoryList:[],
            loading: false
        }
    }

    getCategories = () => {
        axios.get('https://clothappbackend.herokuapp.com/category/all')
            .then(res => {
                this.setState({
                    CategoryList: res.data
                });
            }).then(() => this.setState({loading:true}))
            .catch((error) => {
                console.log(error);
            })
    }

    componentDidMount() {
        axios.get('https://clothappbackend.herokuapp.com/products/view-product/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    Products:res.data,
                })
            }).then(() => this.getCategories())
            .catch((error) => {
                console.log(error + 'mko aul');
            })

    }

    ChangeEventFn = (event) => {
        this.setState({
                Products: {
                    ...this.state.Products,
                    [event.target.name]: event.target.value,
                }
            },() =>
                console.log(this.state.Products)

        )
        this.forceUpdate();
    }

    onSumbit(e){
        e.preventDefault();

        axios.put('https://clothappbackend.herokuapp.com/products/editProductsDetails/' + this.props.match.params.id, this.state.Products)
            .then((res) => {
                console.log(res.data)
                console.log('Student successfully updated')
            })
            .then(()=> this.props.history.push('/viewListOfProduct'))
            .catch((error) => {
            console.log(error)
        })

    }

    render() {
        if(this.state.Products === null)
            return (<LoaderComponent top={'100px'}/>)
        if(this.state.CategoryList.length === 0)
            return (<LoaderComponent top={'100px'}/>)

        return(
            <div>
                <Typography component="h1" variant="h4" align="center">
                    Edit Products Details
                </Typography>
                {this.state.loading &&

                    <div className={"container-sm"}>
                        <TextField name={"ProductName"} value={this.state.Products.ProductName} label="Product Name"
                                   variant="outlined"
                                   InputLabelProps={{
                                       shrink: true,
                                   }} onChange={(event) => this.ChangeEventFn(event)} required/>
                        <br/><br/>

                        <TextField name={"ProductBrand"} value={this.state.Products.ProductBrand} label="Product Brand"
                                   variant="outlined"
                                   InputLabelProps={{
                                       shrink: true,
                                   }} onChange={(event) => this.ChangeEventFn(event)} required/>
                        <br/><br/>

                        <FormLabel>Select Category</FormLabel>
                        <FormControl value={this.state.Products.Category} as="select" size="sm" name={"Category"}
                                     onChange={(event) => this.ChangeEventFn(event)} custom>
                            {
                                this.state.CategoryList.map((text,index) =>
                                    <option key={index} value={text.name}>{text.name}</option>
                                )
                            }
                        </FormControl>
                        <br/><br/>

                        <FormLabel>Select Sub Category</FormLabel>
                        <FormControl value={this.state.Products.SubCategory} as="select" size="sm" name={"SubCategory"}
                                     onChange={(event) => this.ChangeEventFn(event)} custom>
                            <option>Select</option>
                            {
                                this.state.CategoryList[this.findIndex()].subCategory.map((text,index) =>
                                    <option key={index} value={text}>{text}</option>
                                )
                            }
                        </FormControl>
                        <br/><br/>


                        <TextField type="number" min="0" label="Price pre Unit" name={"PricePerUnit"}
                                   value={this.state.Products.PricePerUnit}
                                   onChange={(event) => this.ChangeEventFn(event)}
                                   InputProps={{
                                       startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                                   }}
                                   variant="outlined"
                                   required/>
                        <br/><br/>

                        <TextField type="number" min="0" label="Discount" name={"Discount"}
                                   value={this.state.Products.Discount}
                                   onChange={(event) => this.ChangeEventFn(event)}
                                   InputProps={{
                                       endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                   }}
                                   variant="outlined"
                                   required/>
                        <br/><br/>

                        <Button className={"center"} type={"submit"} variant="contained" color="primary" size="large"
                                onClick={(e) => this.onSumbit(e)}>
                            Edit
                        </Button>

                    </div>
                }
                { !this.state.loading &&
              <LoaderComponent top={'100px'}/>
                }
            </div>
        )
    }

    findIndex = () => {
        if(this.state.CategoryList.length === 0)
            return 0
        else {
            var index
            if(this.state.Products.Category ==='')
                return  0
            else
                index = this.state.CategoryList.findIndex(x => x.name === this.state.Products.Category);
            return index
        }
    }
}
export default EditProductsDetails