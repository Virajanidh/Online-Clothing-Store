import React, {Component} from "react";
import axios from "axios";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import Button from "@material-ui/core/Button";
import "./tablecss.css"
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit"
import ViewList from "@material-ui/icons/ViewList"
import AddCircleSharp from '@material-ui/icons/AddCircleSharp'

class ShowAllProdcuts extends Component{

    constructor(props) {
        super(props);
        this.state = {
            products:[]
        }
    }

    componentDidMount() {
        axios.get('https://clothappbackend.herokuapp.com/products/')
            .then(res => {
                this.setState({
                    products: res.data
                });
            })
            .catch((error) => {
                console.log(error);
            })

    }

    deleteProduct = (e,id) => {
        e.preventDefault();
        axios.delete('https://clothappbackend.herokuapp.com/products/deleteProduct/' + id)
            .then((res) => {
                window.location.reload();
            }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        const columns = [
            {
                Header: "Product Name",
                accessor: "ProductName",
                style:{
                    textAlign:"center",
                    color:"red"
                },
                width: 200, minwidth: 200, maxwidth: 200
            },
            {
                Header: "Product Brand",
                accessor: "ProductBrand",
                style:{
                    textAlign:"center"
                },
                width: 150, minwidth: 200, maxwidth: 200
            },
            {
                Header: "Category",
                accessor: "Category",
                style:{
                    textAlign:"center"
                },
                width: 120, minwidth: 200, maxwidth: 200
            },
            {
                Header: "Sub Category",
                accessor: "SubCategory",
                style:{
                    textAlign:"center"
                },
                width: 120, minwidth: 200, maxwidth: 200
            },
            {
                Header: "Price LKR",
                accessor: "PricePerUnit",
                style:{
                    textAlign:"center"
                },
                width: 100, minwidth: 200, maxwidth: 200
            },
            {
                Header: "Discount %",
                accessor: "Discount",
                style:{
                    textAlign:"center"
                },
                width: 100, minwidth: 200, maxwidth: 200
            },
            {
                Header: "No Of Items",
                Cell: props => {
                    return(
                        <div>
                        {this.numOfItem(props.original._id)  }
                            <Button aria-label="add an alarm" size={"small"}
                                    onClick={() => this.props.history.push('/editItemsDetails/' + props.original._id)} startIcon={<ViewList/>} />
                            <Button size={"small"} variant="outline-light btn-sm"
                                    onClick={() => this.props.history.push('/addnewItemsToProduct/' + props.original._id)} startIcon={<AddCircleSharp/>} />
                        </div>
                    )
                },style: {
                  textAlign: "center"
                },
                width: 220, minwidth: 200, maxwidth: 200,
                filterable: false
            },
            {
                Header:"Actions",
                Cell:props => {
                    return(
                        <div>
                            <Button size="small" variant="btn btn-warning" startIcon={<Edit/>}
                                    onClick={() => this.props.history.push('/editProductDetails/' + props.original._id)}/>
                            <Button size="small" variant="btn btn-danger"  startIcon={<DeleteIcon/>}
                              onClick={(e) => {
                                  if (window.confirm('Are you sure you wish to delete this item?')) this.deleteProduct(e, props.original._id)
                              }} />
                        </div>
                    )
                },width: 200, minwidth: 200, maxwidth: 200,
                filterable: false
            }
        ]
        return(
            <div>
                <Typography component="h1" variant="h4" align="center">
                    List Of Products
                </Typography>
            <ReactTable
            columns={columns}
             data={this.state.products}
            filterable
            defaultFilterMethod={this.filterCaseInsensitive}
            defaultPageSize={10}
            noDataText={"Please Wait......"}>

            </ReactTable>
            </div>
        )
    }

    numOfItem = (id) => {
        const index = this.state.products.map(e => e._id).indexOf(id);
        return this.state.products[index].Details.length

    }

    filterCaseInsensitive = (filter, row) => {
        const id = filter.pivotId || filter.id;
        const content = row[id];
        if (typeof content !== 'undefined') {
            // filter by text in the table or if it's a object, filter by key
            if (typeof content === 'object' && content !== null && content.key) {
                return String(content.key).toLowerCase().includes(filter.value.toLowerCase());
            } else {
                return String(content).toLowerCase().includes(filter.value.toLowerCase());
            }
        }

        return true;
    };
}


export default ShowAllProdcuts