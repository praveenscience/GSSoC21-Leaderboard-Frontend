import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import GitHubIcon from '@material-ui/icons/GitHub';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const columns = [
  { id: 'position', label: 'Position', minWidth: 50 },
  { id: 'avatar', label: 'Avatar', minWidth: 100 },
  { id: 'username', label: 'Username', minWidth: 170 },

  {
    id: 'prnums',
    label: 'No. Of PRs',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'score',
    label: 'Score',
    minWidth: 170,
    align: 'right'
  }
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(username, avatar, prnums, score, prlinks) {
  return { username, avatar, prnums, score, prlinks };
}

const rows = [];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  appbar: {
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to right, #EF971A, #FF512E)"

  },
  leaderimg: {
    width: 100,
    borderRadius: 1000
  },
  leaderimgbig: {
    width: 130,
    borderRadius: 1000
  },
  leaderdiv: {
    width: "100%",
    justifyContent: "space-between"
  },
  popover: {
    pointerEvents: 'none',
  }
});


export default function BasicTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searched, setSearched] = useState("")
  let [leaderss, setLeaderss] = useState({});
  let [timestamp, setTimsestamp] = useState("");
  let [links, setLinks] = useState("");
  const requestSearch = (searchedVal) => {
    const filteredRows = rows.filter((row) => {
      return row.username[0].toLowerCase().includes(searchedVal.toLowerCase());
    });

    setSearched(filteredRows);
  };;

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetch("http://localhost:3000/leaderboard").then(res => res.json()).then(data => {
      setLeaderss(data.leaderboard);
      setTimsestamp(data.last_updated);
    });
  }, []);

  const [open, setOpen] = React.useState(false);
  let prlinks = []
  let handleClickOpen = (num) => {
    setOpen(true);
    for (let link in leaderss[num].pr_links) {

      prlinks.push(leaderss[num].pr_links[link] + "\n\n\n\n");

    }
    setLinks(prlinks)
  };

  const handleClose = () => {
    prlinks = []
    setOpen(false);
  };



  for (let leader in leaderss) {
    rows.push(createData([leaderss[leader].login, leaderss[leader].profile_url], leaderss[leader].avatar_url, leaderss[leader].pr_count, leaderss[leader].score, leaderss[leader].profile_url, leaderss[leader].pr_links))
  }
  return (
    <div>
      <AppBar position="static" className={classes.appbar}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <img src="https://gssoc.girlscript.tech/images/type.png" style={{ width: 220, height: 50, marginTop: 5, marginRight: 30 }} />
          <h2>Leaderboard</h2>
        </div>
      </AppBar>
      <div style={{ paddingLeft: 100, paddingRight: 100, paddingTop: 50, paddingBottom: 50, textAlign: "center" }}>
        <div style={{ marginBottom: 40, marginTop: 20, alignItems: "center", display: "flex", justifyContent: "center" }}>

          <div style={{ marginRight: 200, marginTop: 50 }}>
            <img src={rows[1] !== undefined ? rows[1].avatar : null} className={classes.leaderimg} />
            <h3>2. {rows[1] !== undefined ? rows[1].username[0] : null}</h3>

          </div>
          <div style={{ textAlign: "center" }}>
            <img src={rows[1] !== undefined ? rows[0].avatar : null} className={classes.leaderimgbig} />
            <h3>1. {rows[1] !== undefined ? rows[0].username[0] : null}</h3>
          </div>
          <div style={{ marginLeft: 200, marginTop: 50, textAlign: "center" }}>
            <img src={rows[1] !== undefined ? rows[2].avatar : null} className={classes.leaderimg} />
            <h3>3. {rows[1] !== undefined ? rows[2].username[0] : null}</h3>
          </div>

        </div>
        <Paper style={{ width: "auto", background: "#F5F5F5", padding: 5, textAlign: "center" }}>
          <p>Last Updated: {timestamp} </p>
        </Paper>

        <Paper>
          {/* <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          /> */}
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    // style = {{ display: rows.indexOf(row) === 0 || rows.indexOf(row) === 1 || rows.indexOf(row) === 2 ? "none" : null }
                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.username}  >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell key={column.id} align={column.align} onClick={() => { handleClickOpen(rows.indexOf(row)); }}>
                            {column.id === 'avatar' ? <Avatar alt="Remy Sharp" src={value} className={classes.small} /> : column.id === 'position' ? rows.indexOf(row) + 1 : column.id === 'username' ? <div style={{ display: "flex", alignItems: "center" }}><GitHubIcon style={{ marginRight: 20 }} /><a href={value[1]} style={{ textDecoration: "none", color: "black" }}>{value[0]}</a></div> : value}

                          </StyledTableCell>
                        );

                      })}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"PR Links:"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {links}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button onClick={handleClose} color="primary" style={{ background: "#FA6329", border: "none", padding: 10, color: "white" }}>
              Close
                            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div >
  );
}