import { useMemo } from "react";
import { useSelector } from "react-redux";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

const createData = (id, name, text, category) => {
  return { id, name, text, category };
};

// const storeTable = (id, text) => {
//   if (id === "text") {
//     return isEnglish(text)
//       ? text.substr(0, 200) + " ..."
//       : text.substr(0, text.indexOf("。") + 1) + " ...";
//   }
//   return "  " + text;
// };

// const isEnglish = (text) => {
//   return !text.split("").some((char) => char.charCodeAt() > 255);
// };

export default function BasicTable() {
  const data = useSelector((state) => state.layout.data);
  const selectedId = useSelector((state) => state.layout.selectedId);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const tableRef = React.createRef();

  const columns = [
    { id: "name", label: "Name", width: "20%" },
    { id: "category", label: "category", width: "10%" },
    { id: "text", label: "text", width: "70%" },
  ];

  const rows = useMemo(() => {
    const rows = [];
    if (selectedId == null) {
      rows.push(createData("", "", "", ""));
      return rows;
    }

    setPage(0);
    const displayedId = data[selectedId].child;
    for (const id of displayedId) {
      const displayedData = data[id];
      rows.push(
        createData(
          displayedData.id,
          displayedData.name,
          displayedData.text,
          displayedData.category
        )
      );
    }
    return rows;
  }, [data, selectedId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    tableRef.current && tableRef.current.scrollIntoView();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 900 }}>
        <Table stickyHeader ref={tableRef} aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
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
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
