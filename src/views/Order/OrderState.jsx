/**
 * Created by 励颖 on 2019/6/6.
 */
import React from "react";
import { withStyles } from '@material-ui/core/styles';
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "components/Table/TablePagnition";
import Divider from '@material-ui/core/Divider';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});
const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);

const styles = theme => ({
  title:{
    fontWeight: 700,
    color: "#37474f",
    marginLeft: "10%",
    margin: "3%"
  },
  table_title:{
    fontWeight: 500,
    fontSize: "20px",
    textAlign: "center"
  },
  td:{
    fontSize: "18px",
    fontWeight: "400",
    textAlign: "center",
    border: "0px solid black",
    height:'35px',
    background:"#455a64",
    color:"white"
  },
  content_td:{
    fontSize: "16px",
    fontWeight: "400",
    textAlign:"center",
    border:"0px solid black",
    height:"35px",
    color:"#455a64"
  }
});

class OrderState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      orders:[],
      page: 0,
      rowsPerPage: 8,
      pending_rows:[
        {order_id:"12123", type:"Market", trader:"123", product:"Gold SEP16", qty:"30", price:"/", old_id:"/" },
        {order_id:"12124", type:"Limit", trader:"120", product:"Gold SEP16", qty:"180", price:"1248", old_id:"/" },
        {order_id:"12125", type:"Stop", trader:"79", product:"Gold SEP16", qty:"70", price:"1400", old_id:"/" },
        {order_id:"12126", type:"Cancel", trader:"198",  product:"Gold SEP16", qty:"/", price:"/", old_id:"10109" },
        {order_id:"12123", type:"Market", trader:"123", product:"Gold SEP16", qty:"30", price:"/", old_id:"/" },
        {order_id:"12124", type:"Limit", trader:"120", product:"Gold SEP16", qty:"180", price:"1248", old_id:"/" },
        {order_id:"12125", type:"Stop", trader:"79", product:"Gold SEP16", qty:"70", price:"1400", old_id:"/" },
        {order_id:"12126", type:"Cancel", trader:"198",  product:"Gold SEP16", qty:"/", price:"/", old_id:"10109" },
      ],
      transacted_rows:[
        {order_id:"12123", type:"Market", trader:"123", product:"Gold SEP16", qty:"30", price:"/", old_id:"/" },
        {order_id:"12124", type:"Limit", trader:"120", product:"Gold SEP16", qty:"180", price:"1248", old_id:"/" },
        {order_id:"12125", type:"Stop", trader:"79", product:"Gold SEP16", qty:"70", price:"1400", old_id:"/" },
        {order_id:"12126", type:"Cancel", trader:"198",  product:"Gold SEP16", qty:"/", price:"/", old_id:"10109" },
        {order_id:"12123", type:"Market", trader:"123", product:"Gold SEP16", qty:"30", price:"/", old_id:"/" },
        {order_id:"12124", type:"Limit", trader:"120", product:"Gold SEP16", qty:"180", price:"1248", old_id:"/" },
        {order_id:"12125", type:"Stop", trader:"79", product:"Gold SEP16", qty:"70", price:"1400", old_id:"/" },
        {order_id:"12126", type:"Cancel", trader:"198",  product:"Gold SEP16", qty:"/", price:"/", old_id:"10109" },
      ]
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  render(){
    const {classes} = this.props;
    const { rows, rowsPerPage, page } = this.state;
    return(
        <div>
          <Card style={{marginTop:"0%"}}>
            <CardHeader style={{background:"#37474f"}}/>
            <CardBody>
              <GridContainer xs={12} sm={12} md={12}>
                <GridItem xs={12} sm={12} md={6}>
                  <h2 className={classes.title}>Real-Time Order State：</h2>
                </GridItem>
              </GridContainer>
              <br/>
              <GridContainer xs={12} sm={12} md={12}>
                <GridItem xs={12} sm={12} md={6}>
                  <Card style={{marginTop:"0%"}}>
                    <CardHeader color="warning" className={classes.table_title}>Pending Orders</CardHeader>
                    <CardBody>
                      <Table>
                        <TableHead>
                          <tr>
                            <td className={classes.td} style={{width:'3%'}}>Order ID</td>
                            <td className={classes.td} style={{width:'2%'}}>Type</td>
                            <td className={classes.td} style={{width:'3%'}}>Trader ID</td>
                            <td className={classes.td} style={{width:'4%'}}>Product</td>
                            <td className={classes.td} style={{width:'2%'}}>Qty</td>
                            <td className={classes.td} style={{width:'2%'}}>Price</td>
                            <td className={classes.td} style={{width:'3%'}}>Old ID</td>
                          </tr>
                        </TableHead>
                        <TableBody>
                          {this.state.pending_rows.map(row => (
                            <tr>
                              <td className={classes.content_td} style={{width:'3%'}}>{row.order_id}</td>
                              <td className={classes.content_td} style={{width:'2%'}}>{row.type}</td>
                              <td className={classes.content_td} style={{width:'3%'}}>{row.trader}</td>
                              <td className={classes.content_td} style={{width:'4%'}}>{row.product}</td>
                              <td className={classes.content_td} style={{width:'2%'}}>{row.qty}</td>
                              <td className={classes.content_td} style={{width:'2%'}}>{row.price}</td>
                              <td className={classes.content_td} style={{width:'3%'}}>{row.old_id}</td>
                            </tr>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Card style={{marginTop:"0%"}}>
                    <CardHeader color="success" className={classes.table_title}>Transacted orders</CardHeader>
                    <CardBody>
                      <Table>
                        <TableHead>
                          <tr>
                            <td className={classes.td} style={{width:'3%'}}>Order ID</td>
                            <td className={classes.td} style={{width:'2%'}}>Type</td>
                            <td className={classes.td} style={{width:'3%'}}>Trader ID</td>
                            <td className={classes.td} style={{width:'4%'}}>Product</td>
                            <td className={classes.td} style={{width:'2%'}}>Qty</td>
                            <td className={classes.td} style={{width:'2%'}}>Price</td>
                            <td className={classes.td} style={{width:'3%'}}>Old ID</td>
                          </tr>
                        </TableHead>
                        <TableBody>
                          {this.state.transacted_rows.map(row => (
                              <tr>
                                <td className={classes.content_td} style={{width:'3%'}}>{row.order_id}</td>
                                <td className={classes.content_td} style={{width:'2%'}}>{row.type}</td>
                                <td className={classes.content_td} style={{width:'3%'}}>{row.trader}</td>
                                <td className={classes.content_td} style={{width:'4%'}}>{row.product}</td>
                                <td className={classes.content_td} style={{width:'2%'}}>{row.qty}</td>
                                <td className={classes.content_td} style={{width:'2%'}}>{row.price}</td>
                                <td className={classes.content_td} style={{width:'3%'}}>{row.old_id}</td>
                              </tr>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </div>
    )
  }
}

export default withStyles(styles)(OrderState);