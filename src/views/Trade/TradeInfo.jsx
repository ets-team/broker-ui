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
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Cookies from "universal-cookie";
import name_company from "variables/variables.jsx";

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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  table:{
    border: '1px solid black',
    width: '92%',
    borderCollapse: 'collapse',
    marginLeft: '5%'
  },
  tableCell:{
    fontSize: "18px",
    fontWeight: 700,
    textAlign: "center",
    color:"#37474f",
    background:"#4fc3f7",
    border: '1px solid black',
    borderCollapse: 'collapse',
    height: '10px'
  },
  topCell:{
    fontSize: "18px",
    fontWeight: 700,
    textAlign: "center",
    color:"#37474f",
    background:"#4fc3f7",
    border: '1px solid black',
    borderBottom: '0px',
  },
  blankCell:{
    background:"#4fc3f7",
    borderRight: '1px solid black',
  },
  contentCell:{
    fontSize: "110%",
    fontWeight: 500,
    textAlign: "center",
    color:"#37474f",
    border: '1px solid black',
    borderCollapse: 'collapse',
  },
  title:{
    fontWeight: 700,
    color: "#37474f",
    marginLeft: "10%",
    margin: "3%"
  }
});

const items = {
  "": [],
  Metal: ["GOLD", "SILVER", "COPPER"],
  Energy: ["OIL", "PITCH", "RUBBER"],
  Derivatives: ["Copper Option", "Rubber Option"]
};

let websocket = null;
class TradeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      orders:[],
      futureName:"",
      period:"",
      page: 0,
      type: "",
      category: "",
      product:"",
      rowsPerPage: 8,
      rows:[]
    }

    let site = "ws://202.120.40.8:30405/websocket/trade";
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
        if (obj.msg_type === "deal_message") {
          let trader1 = "";
          let trader2 = "";
          console.log("hello");

          this.state.rows.unshift({
            tradeID: obj.tradeID,
            product: "OIL JULY16",
            period: obj.period,
            price: obj.price,
            qty: obj.qty,
            trader1: obj.buyer_name,
            company1: "MS",
            side1: "sell",
            trader2: obj.seller_name,
            company2: "ABC Crop",
            side2: "buy"
          })
          this.forceUpdate();
        }
      }
    };

    websocket.onclose = function(event){
      console.log("onclose:",event.data);
      websocket = null;
    };

    //连接异常.
    websocket.onerror = function(event){
      console.log("onmerror:",event.data);
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

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

  searchTradingInfo=()=>{
    /*fetch('http://202.120.40.8:30405/broker_tradehistory?futureName='+this.state.type + '&period='+this.state.period,
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
                this.state.rows.length = 0;
                let trader1;
                let trader2;
                let order1;
                let order2;
                let side1;
                let side2;
                for(let i=0; i<result.length; i++){
                  if(result[i]["initiator_side"] === "b"){
                    trader1 = result[i]["buyer_name"];
                    trader2 = result[i]["seller_name"];
                    order1 = result[i]["buyer_order_id"];
                    order2 = result[i]["seller_order_id"];
                    side1 = "buy";
                    side2 = "sell";
                  }
                  else{
                    trader1 = result[i]["seller_name"];
                    trader2 = result[i]["buyer_name"];
                    order1 = result[i]["seller_order_id"];
                    order2 = result[i]["buyer_order_id"];
                    side1 = "sell";
                    side2 = "buy";
                  }
                  this.state.rows.push({
                    tradeID: result[i]["tradeID"],
                    product: result[i]["future_name"],
                    period: result[i]["period"],
                    price:result[i]["price"],
                    qty:result[i]["qty"],
                    trader1: trader1,
                    company1: order1,
                    side1: side1,
                    trader2: trader2 ,
                    company2:order2,
                    side2: side2,
                  })
                }
                console.log(this.state.rows.length);
                this.forceUpdate();
              })
        });*/
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
                  <h2 className={classes.title}>Real-Time Trading Info：</h2>
                </GridItem>
              </GridContainer>
              <Divider style={{width:"95%"}}/>
              <br/>

              <FormControl
                  variant="outlined"
                  style={{ width: "15%", marginLeft:"37%" }}
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
                  onClick={this.searchTradingInfo}
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
              <h1/>
              <GridContainer xs={12} sm={12} md={12}>
                <GridItem xs={12} sm={12} md={12}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <td className={classes.topCell} style={{width:"10%"}} >TradeID</td>
                        <td className={classes.topCell} style={{width:"12%"}}>Product</td>
                        <td className={classes.topCell} style={{width:"10%"}} >Period</td>
                        <td className={classes.topCell} style={{width:"10%"}} >Price</td>
                        <td className={classes.topCell} style={{width:"10%"}} >Qty</td>
                        <td className={classes.tableCell} style={{width:"24%"}} colSpan={3}>Initiator</td>
                        <td className={classes.tableCell} style={{width:"24%"}} colSpan={3}>Completion</td>
                      </TableRow>
                      <TableRow>
                        <td className={classes.blankCell} />
                        <td className={classes.blankCell} />
                        <td className={classes.blankCell} />
                        <td className={classes.blankCell} />
                        <td className={classes.blankCell} />
                        <td className={classes.tableCell} style={{width:"8%"}}>Trader</td>
                        <td className={classes.tableCell} style={{width:"8%"}}>Company</td>
                        <td className={classes.tableCell} style={{width:"8%"}}>Side</td>
                        <td className={classes.tableCell} style={{width:"8%"}}>Trader</td>
                        <td className={classes.tableCell} style={{width:"8%"}}>Company</td>
                        <td className={classes.tableCell} style={{width:"8%"}}>Side</td>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,key) => (
                          <TableRow >
                            <td style={{width:"8%"}} className={classes.contentCell}>{row.tradeID}</td>
                            <td style={{width:"10%"}} className={classes.contentCell}>{row.product}</td>
                            <td style={{width:"8%"}} className={classes.contentCell}>{row.period}</td>
                            <td style={{width:"7%"}} className={classes.contentCell}>{row.price}</td>
                            <td style={{width:"7%"}} className={classes.contentCell}>{row.qty}</td>
                            <td style={{width:"8%"}} className={classes.contentCell}>{row.trader1}</td>
                            <td style={{width:"8%"}} className={classes.contentCell}>{row.company1}</td>
                            <td style={{width:"6%"}} className={classes.contentCell}>{row.side1}</td>
                            <td style={{width:"8%"}} className={classes.contentCell}>{row.trader2}</td>
                            <td style={{width:"8%"}} className={classes.contentCell}>{row.company2}</td>
                            <td style={{width:"6%"}} className={classes.contentCell}>{row.side2}</td>
                          </TableRow>
                        )
                      )}
                      <TableRow/>
                      <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={3}
                            count={this.state.rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                              native: true,
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActionsWrapped}

                        />
                      </TableRow>
                    </TableBody>
                  </Table>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </div>
    )
  }
}

export default withStyles(styles)(TradeInfo);