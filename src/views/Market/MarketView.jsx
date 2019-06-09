/**
 * Created by 励颖 on 2019/6/8.
 */
import React from "react";
import ChartistGraph from "react-chartist";
import { successColor } from "assets/jss/material-dashboard-react.jsx";
//@material-ui/core
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "components/Table/TablePagnition";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
//@material-ui/icons
import Search from "@material-ui/icons/Search";
import AccessTime from "@material-ui/icons/AccessTime";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
//components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: "20px"
  },
  td:{
    width: "4%",
    color: "#424242",
    fontSize: "18px",
    fontWeight: "700",
    textAlign: "center",
    border: "0px solid black",
    height:'35px'
  },
  sort_td:{
    width: "7%",
    color: "#424242",
    fontSize: "18px",
    fontWeight: "500",
    textAlign: "center",
    border: "0px solid black",
    height:'35px'
  },
  vol: {
    width: "5%",
    color: "#424242",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "center",
    border: "1px solid black",
    height:'30px'
  },
  price:{
    width: "5%",
    color: "#424242",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "center",
    border: "1px solid black",
    height:'30px'
  },
  level:{
    width: "3%",
    color: "#424242",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "center",
    border: "1px solid black",
    height:'30px'
  },
  successText: {
    color: successColor
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    color: "#999999",
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    color: "#999999",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    color: "#3C4858",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontWeight: "400",
      lineHeight: "1"
    },
    formControl: {
      margin: theme.spacing.unit,
      width: "500%"
    }
  }
});


const items = {
  "": [],
  Metal: ["Gold", "Silver", "Copper", "Aluminium", "Zinc", "Lead", "Nickel", "Tin"],
  Energy: ["Crude Oil", "Fuel Oil", "Pitch", "Rubber"],
  Derivatives: ["Copper Option", "Rubber Option"]
};


class MarketView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "Gold",
      period: "SEP16",
      category: "",
      page: 0,
      rowsPerPage: 8,
      price_rows:[
        {futureID: "12345", product: "Gold", period: "SEP16", price: "1248", buy_vol: "32", sell_vol: "50"},
        {futureID: "12348", product: "Silver", period: "OCT14", price: "1070", buy_vol: "80", sell_vol: "20"}
      ],
      depth_rows: [
        { level1: "", buy_vol: "", price: 1254, sell_vol: 127, level2: 3 },
        { level1: "", buy_vol: "", price: 1252, sell_vol: 32, level2: 2 },
        { level1: "", buy_vol: "", price: 1250, sell_vol: 50, level2: 1 },
        { level1: 1, buy_vol: 90, price: 1248, sell_vol: -1, level2: -1 },
        { level1: 2, buy_vol: 340, price: 1246, sell_vol: -1, level2: -1 },
        { level1: 3, buy_vol: 187, price: 1244, sell_vol: -1, level2: -1 }
      ]
    };
    //console.log(cookies.get("username"));

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
      type: e.target.value
    });
  };

  handleChangePeriod = e => {
    console.log(e.target.value);
    this.setState({
      period: e.target.value
    });
  };

  handleItems = category => {
    let selections = items[category];
    let result = [];
    for (let i = 0; i < selections.length; i++)
      result.push(<MenuItem value={selections[i]}>{selections[i]}</MenuItem>);
    return result;
  };

  handleSortPrice=()=>{
    console.log("hello");
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };




  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.price_rows.length - page * rowsPerPage);
    let candidates = this.handleItems(this.state.category);
    return (
      <div>
        <br />
        <Card chart>
          <CardHeader style={{ background: "#37474f" }} />
          <CardBody>
            <GridContainer xs={12} sm={12} md={12}>
              <GridItem xs={12} sm={12} md={12} />
              <Card>
                <CardBody>
                  <GridContainer xs={12} sm={12} md={12}>
                    <GridItem xs={12} sm={12} md={1} />
                    <GridItem xs={12} sm={12} md={2}>
                      <FormControl
                        variant="outlined"
                        style={{ width: "100%", marginTop: "-30px" }}
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
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                      <FormControl
                        variant="outlined"
                        style={{ width: "100%", marginTop: "-30px" }}
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
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                      <FormControl
                        variant="outlined"
                        style={{ width: "100%", marginTop: "-30px" }}
                      >
                        <InputLabel>Period</InputLabel>
                        <Select
                          value={this.state.period}
                          onChange={this.handleChangePeriod}
                          input={<OutlinedInput />}
                        >
                          <MenuItem value="SEP16">SEP16</MenuItem>
                          <MenuItem value="OCT14">OCT14</MenuItem>
                          <MenuItem value="NOV18">NOV18</MenuItem>
                        </Select>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                      <Button
                        onClick={this.searchDepth}
                        style={{
                          background: "#37474f",
                          color: "white",
                          fontSize: "18px",
                          marginTop: "-3%"
                        }}
                      >
                        <Search />
                        &nbsp;&nbsp;Search
                      </Button>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridContainer>
            <GridContainer xs={12} sm={12} md={12}>
              <GridItem xs={12} sm={12} md={8}>
                <Card chart>
                  <CardBody>
                    <Table>
                      <TableHead >
                        <tr>
                          <td className={classes.sort_td} style={{background:"#455a64", color:"white"}}>
                            Future ID
                            <IconButton size="small" edge="false">
                              <UnfoldMore onClick={this.handleSortPrice} style={{color:"white"}}/>
                            </IconButton>
                          </td>
                          <td className={classes.td} style={{background:"#455a64", color:"white"}}>Product</td>
                          <td className={classes.td} style={{background:"#455a64", color:"white"}}>Period</td>
                          <td className={classes.sort_td} style={{background:"#455a64", color:"white"}}>
                            Price
                            <IconButton size="small" edge="false">
                              <UnfoldMore onClick={this.handleSortPrice} style={{color:"white"}}/>
                            </IconButton>
                          </td>
                          <td className={classes.td} style={{background:"#455a64", color:"white"}}>Buy-Vol</td>
                          <td className={classes.td} style={{background:"#455a64", color:"white"}}>Sell-Vol</td>
                          <td className={classes.td} style={{background:"#455a64", color:"white"}}>View</td>
                        </tr>
                      </TableHead>
                      <TableBody>
                        {this.state.price_rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                            <tr>
                                <td className={classes.sort_td} >{row.futureID}</td>
                                <td className={classes.td} >{row.product}</td>
                                <td className={classes.td} >{row.period}</td>
                                <td className={classes.sort_td} >{row.price}</td>
                                <td className={classes.td} >{row.buy_vol}</td>
                                <td className={classes.td} >{row.sell_vol}</td>
                                <td className={classes.td} >
                                  <Button style={{color:"#455a64"}}>
                                    <RemoveRedEye/>
                                  </Button>
                                </td>
                            </tr>
                        ))}
                      </TableBody>
                    </Table>
                  </CardBody>
                  <CardFooter chart>
                    <TableRow>
                      <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          colSpan={3}
                          count={this.state.price_rows.length}
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
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Card chart>
                  <CardHeader color="success" style={{fontSize:"16px"}}>Market Depth of {this.state.type}  {this.state.period}</CardHeader>
                  <CardBody>
                    <Table style={{ border: "1px solid black" }}>
                      <TableHead>
                        <tr>
                          <td className={classes.level}>Level</td>
                          <td className={classes.vol}>Buy-Vol</td>
                          <td className={classes.price}>Price</td>
                          <td className={classes.vol}>Sell-Vol</td>
                          <td className={classes.level}>Level</td>
                        </tr>
                      </TableHead>
                      <TableBody>
                        {this.state.depth_rows.map(row => (
                            <tr>
                              <td
                                  className={classes.level}
                                  style={{ background: "#bbdefb" }}
                              >
                                {row.level1 > 0 ? row.level1 : ""}
                              </td>
                              <td
                                  className={classes.vol}
                                  style={{ background: "#bbdefb" }}
                              >
                                {row.buy_vol > 0 ? row.buy_vol : ""}
                              </td>
                              {row.level1 > 0 ? (
                                  <td
                                      className={classes.price}
                                      style={{ background: "#9e9e9e", color: "#ad1457" }}
                                  >
                                    {row.price}
                                  </td>
                              ) : row.level2 === 1 ? (
                                  <td
                                      className={classes.price}
                                      style={{ background: "#fff59d", color: "#01579b" }}
                                  >
                                    {row.price}
                                  </td>
                              ) : (
                                  <td
                                      className={classes.price}
                                      style={{ background: "#9e9e9e", color: "#01579b" }}
                                  >
                                    {row.price}
                                  </td>
                              )}
                              <td
                                  className={classes.vol}
                                  style={{ background: "#f8bbd0" }}
                              >
                                {row.sell_vol > 0 ? row.sell_vol : ""}
                              </td>
                              <td
                                  className={classes.level}
                                  style={{ background: "#f8bbd0" }}
                              >
                                {row.level2 > 0 ? row.level2 : ""}
                              </td>
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
    );
  }
}

export default withStyles(styles)(MarketView);
