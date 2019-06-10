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
      rowsPerPage: 8,
      rows:[
          {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
          {tradeID: 312080, product: "Gold Swaps", period: "OCT14", price:1228, qty:180, trader1: "Sam Wang", company1: "ABC Crop", side1:"buy", trader2: "SiXian Liu", company2:"Ms", side2:"sell",},
          {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
          {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
          {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},
        {tradeID: 312345, product: "Gold Swaps", period: "SEP16", price:1246, qty:50, trader1: "Sam Wang", company1: "ABC Crop", side1:"sell", trader2: "SiXian Liu", company2:"Ms", side2:"buy",},

      ]
    }

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


    let site = "ws://202.120.40.8:30405/websocket/trade";
    if(websocket === null){
      websocket = new WebSocket(site);
    }

    websocket.onopen = function(event){
      console.log("建立连接成功！");
    };

    websocket.onmessage = function(event){
      console.log(event.data);
      if(event.data.type === "deal_message")
      {
        let trader1= "";
        let trader2= "";
        /*this.state.rows.unshift({
          tradeID: 312345,
          product: "Gold Swaps",
          period: "SEP16",
          price:1246,
          qty:50,
          trader1: "Sam Wang",
          company1: name_company[trader1],
          side1:"sell",
          trader2: name_company[trader2],
          company2:"Ms",
          side2:"buy"
        })*/
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
                  <h2 className={classes.title}>Real-Time Trading Info：</h2>
                </GridItem>
              </GridContainer>
              <Divider style={{width:"95%"}}/>
              <br/>
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