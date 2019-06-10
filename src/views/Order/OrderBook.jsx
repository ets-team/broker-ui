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

let websocket = null;

class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      orders:[],
      page: 0,
      rowsPerPage: 8,
      futureName:"OIL",
      period:"JULY16",
      pending_rows:[
        {order_id:"12123", type:"Market", trader:"123", product:"Gold SEP16", qty:"30", price:"/", old_id:"/" },
        ],
      transacted_rows:[
        {trade_id:"", order_id:"12123", buy_order_id:"", seller_id:"123", sell_order_id:"", product:"Gold SEP16", qty:"30", price:"/"},
        ]
    };


    fetch('http://202.120.40.8:30405/broker_tradehistory?futureName='+this.state.futureName + '&period='+this.state.period,
        {
          method: 'GET',
          mode: 'cors',
        })
        .then(response => {
          console.log('Request successful', response);
          //console.log("status:",response.status);
          return response.json()
              .then(result => {
                console.log(result);
              })
        });

    let site = "ws://202.120.40.8:30405/websocket/def";
    if(websocket === null){
      websocket = new WebSocket(site);
    }

    websocket.onopen = function(event){
      console.log("建立连接成功！");
    };

    websocket.onmessage = function(event){
      console.log(event.data);
      if(event.data.type === "order_process_message") {
        let type;
        if(event.data.type === "l")
          type = "Limit";
        else if(event.data.type === "m")
          type = "Market";
        else if (event.data.type === "s")
          type = "Stop";
        this.state.pending_rows.unshift({
          order_id: event.data.orderID,
          type: type,
          trader: event.data.traderID,
          product: "OIL JULY16",//--------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          qty: event.data.amount,
          price: event.data.price,
          old_id: "/"
        });
      }
      else if(event.data.type === "cancel_message"){
        this.state.pending_rows.unshift({
          order_id: event.data.order_id,
          type: "Cancel",
          trader: event.data.traderID,
          product: "/",
          qty: "/",
          price: "/",
          old_id: event.data.cancel_id,
        });
      }
      else if (event.data.type === "deal_message") {
        this.state.transacted_rows.unshift({
          trade_id: event.data.tradeID,
          buyer_id: event.data.buyer_name,
          buy_order_id: event.data.buyer_order_id,
          seller_id: event.data.seller_name,
          sell_order_id: event.data.seller_order_id,
          product: event.data.future_name + " " + event.data.period,
          qty: event.data.qty,
          price: event.data.price,
        })
      }
      //this.forceUpdate();
      //judge whether delete the last element in order book
      /*while(this.state.pending_rows.length > 10)
          this.state.pending_rows.pop();
      while(this.state.transacted_rows.length > 10)
          this.state.transacted_rows.pop();*/
    }
    ;

    websocket.onclose = function(event){
      console.log("onclose:",event.data);
    };

    //连接异常.
    websocket.onerror = function(event){
      console.log("onmerror:",event.data);
      websocket = null;
    };
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
                  <h2 className={classes.title}>Real-Time Order Book：</h2>
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
                            <td className={classes.td} style={{width:'3%'}}>Trade ID</td>
                            <td className={classes.td} style={{width:'2%'}}>Buyer </td>
                            <td className={classes.td} style={{width:'3%'}}>Buy Order</td>
                            <td className={classes.td} style={{width:'2%'}}>Seller </td>
                            <td className={classes.td} style={{width:'3%'}}>Sell Order</td>
                            <td className={classes.td} style={{width:'4%'}}>Product</td>
                            <td className={classes.td} style={{width:'2%'}}>Qty</td>
                            <td className={classes.td} style={{width:'2%'}}>Price</td>
                          </tr>
                        </TableHead>
                        <TableBody>
                          {this.state.transacted_rows.map(row => (
                              <tr>
                                <td className={classes.content_td} style={{width:'3%'}}>{row.trade_id}</td>
                                <td className={classes.content_td} style={{width:'2%'}}>{row.buyer_id}</td>
                                <td className={classes.content_td} style={{width:'3%'}}>{row.buyer_order_id}</td>
                                <td className={classes.content_td} style={{width:'2%'}}>{row.seller_id}</td>
                                <td className={classes.content_td} style={{width:'3%'}}>{row.sell_order_id}</td>
                                <td className={classes.content_td} style={{width:'4%'}}>{row.product}</td>
                                <td className={classes.content_td} style={{width:'2%'}}>{row.qty}</td>
                                <td className={classes.content_td} style={{width:'2%'}}>{row.price}</td>
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

export default withStyles(styles)(OrderBook);