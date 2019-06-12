/**
 * Created by 励颖 on 2019/6/6.
 */
import React from "react";
import { withStyles } from '@material-ui/core/styles';
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePaginationActions from "components/Table/TablePagnition";
import Divider from '@material-ui/core/Divider';
import TableHead from '@material-ui/core/TableHead';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
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

const items = {
  "": [],
  Metal: ["GOLD", "SILVER", "COPPER"],
  Energy: ["OIL", "PITCH", "RUBBER"],
  Derivatives: ["Copper Option", "Rubber Option"]
};

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
      type:"",
      period:"",
      category:"",
      pending_rows:[],
      transacted_rows:[]
    };

    let site = "ws://202.120.40.8:30405/websocket/def";
    if(websocket === null){
      websocket = new WebSocket(site);
    }

    websocket.onopen = function(event){
      console.log("建立连接成功！");
    };

    websocket.onmessage = (event)=>{
      console.log(event.data);
      if(event.data !== "Connected") {
        let obj = JSON.parse(event.data);
        if (obj.msg_type === "order_process_message") {
          let type;
          if (obj.type === "l")
            type = "Limit";
          else if (obj.type === "m")
            type = "Market";
          else if (obj.type === "s")
            type = "Stop";
          this.state.pending_rows.unshift({
            order_id: obj.orderID,
            type: type,
            trader: obj.traderID,
            product: "OIL JULY16",
            qty: obj.amount,
            price: obj.price,
            old_id: "/"
          });
          this.forceUpdate();
        }
        else if (obj.type === "cancel_message") {
          this.state.pending_rows.unshift({
            order_id: obj.order_id,
            type: "Cancel",
            trader: obj.traderID,
            product: "/",
            qty: "/",
            price: "/",
            old_id: obj.cancel_id,
          });
          this.forceUpdate();
        }
        else if (event.data.type === "deal_message") {
          this.state.transacted_rows.unshift({
            trade_id: obj.tradeID,
            buyer_id: obj.buyer_name,
            buy_order_id: obj.buyer_order_id,
            seller_id: obj.seller_name,
            sell_order_id: obj.seller_order_id,
            product: obj.future_name + " " + obj.period,
            qty: obj.qty,
            price: obj.price,
          });
          this.forceUpdate();
        }
      }

      //judge whether delete the last element in order book
      if(this.state.pending_rows.length > 10)
          this.state.pending_rows.pop();
      if(this.state.transacted_rows.length > 10)
          this.state.transacted_rows.pop();
    }
    ;

    websocket.onclose = function(event){
      console.log("onclose:",event.data);
      websocket = null;
    };

    //连接异常.
    websocket.onerror = function(event){
      console.log("onmerror:",event.data);
      websocket = null;
    };
  }

  handleChangeCategory = e => {
    console.log(e.target.value);
    this.setState({
      category: e.target.value,
      type: ""
    });
  };

  handleChangeType = e => {
    console.log(e.target.value);
    this.setState({
      type: e.target.value,
    });
  };

  handleChangePeriod = e => {
    console.log(e.target.value);
    this.setState({
      period: e.target.value,
    });
  };

  handleItems = category => {
    let selections = items[category];
    let result = [];
    for (let i = 0; i < selections.length; i++)
      result.push(<MenuItem value={selections[i]}>{selections[i]}</MenuItem>);
    return result;
  };

  searchProduct=()=> {
    fetch('http://202.120.40.8:30405/active_order?futureName=' + this.state.type + '&period=' + this.state.period,
        {
          method: 'GET',
          mode: 'cors',
        })
        .then(response => {
          console.log('Request successful', response);
          //console.log("status:",response.status);
          return response.json()
              .then(result => {
                console.log("result:", result);
                for(let i=0; i<result.length; i++){
                  let type;
                  let product;
                  if(result[i]["type"] === "m")
                    type = "Market";
                  else if(result[i]["type"] === "l")
                    type = "Limit";
                  else if(result[i]["type"] === "s")
                    type = "Stop";
                  else if(result[i]["type"] === "c")
                    type = "Cancel";
                  if(result[i]["futureID"] === 1)
                    product = "OIL JULY16";
                  else if(result[i]["futureID"] === 2)
                    product = "OIL AUG16";
                  else if(result[i]["futureID"] === 4)
                    product = "GOLD JULY16";
                  else if(result[i]["futureID"] === 6)
                    product = "SILVER JULY16";
                  this.state.pending_rows.push({
                    order_id: result[i]["orderID"],
                    type: type,
                    trader: result[i]["traderID"],
                    product: product,
                    qty: result[i]["qty"],
                    price:result[i]["price"],
                    old_id: result[i]["orderID"]=== 0 ? "/": result[i]["orderID"]
                  })
                  this.forceUpdate();
                  if(this.state.pending_rows.length > 10)
                    this.state.pending_rows.pop();
                }

              })
        })

    fetch('http://202.120.40.8:30405/broker_tradehistory?futureName='+this.state.type + '&period='+this.state.period,
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
                this.state.transacted_rows.length = 0;
                for (let i = 0; i < result.length; i++) {
                  this.state.transacted_rows.push({
                    trade_id: result[i]["tradeID"],
                    buy_order_id: result[i]["buyer_order_id"],
                    sell_order_id: result[i]["seller_order_id"],
                    product: result[i]["future_name"] + " " +result[i]["period"],
                    qty: result[i]["qty"],
                    price: result[i]["price"]
                  })
                  this.forceUpdate();
                }
                console.log("tran size:", this.state.transacted_rows.length);

              })
        })
  }


  render(){
    const {classes} = this.props;
    const { rows, rowsPerPage, page } = this.state;
    let candidates = this.handleItems(this.state.category);
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
              <Divider style={{width:"95%"}}/>
              <br/>

              <FormControl
                  variant="outlined"
                  style={{ width: "15%",}}
              >
                <InputLabel>Category</InputLabel>
                <Select
                    value={this.state.category}
                    onChange={this.handleChangeCategory}
                    input={<OutlinedInput />}
                >
                  <MenuItem value="Metal">Metal</MenuItem>
                  <MenuItem value="Energy">Energy</MenuItem>
                  <MenuItem value="Derivatives">Derivatives</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                  variant="outlined"
                  style={{ width: "15%", marginLeft:"1%" }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                    value={this.state.type}
                    onChange={this.handleChangeType}
                    input={<OutlinedInput />}
                >
                  {candidates}
                </Select>
              </FormControl>

              <FormControl
                  variant="outlined"
                  style={{ width: "15%", marginLeft:"1%" }}
              >
                <InputLabel>Period</InputLabel>
                <Select
                    value={this.state.period}
                    onChange={this.handleChangePeriod}
                    input={<OutlinedInput />}
                >
                  <MenuItem value="JULY16">JULY16</MenuItem>
                  <MenuItem value="AUG16">AUG16</MenuItem>
                  <MenuItem value="SEP16">SEP16</MenuItem>
                </Select>
              </FormControl>

              <Button
                  onClick={this.searchProduct}
                  style={{
                    background: "#37474f",
                    color: "white",
                    fontSize: "18px",
                    marginLeft:"1%"
                  }}
              >
                <Search />
                &nbsp;&nbsp;Search
              </Button>
              <br/>
              <br/>
              <h1/>
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
                            <td className={classes.td} style={{width:'3%'}}>Buy Order</td>
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
                                <td className={classes.content_td} style={{width:'3%'}}>{row.buy_order_id}</td>
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