import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Row(props) {
  const { row, language } = props;
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/CustomerProfile/${row.customerId}`);
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span className="trTableSpan">{row.customerId}</span>
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span className="trTableSpan">
          <span className="mr-1 trTableSpan">{row.customerFirstName}</span>
          <span className="trTableSpan">{row.customerLastName}</span>
        </span>
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span className="trTableSpan">{row.customerPhone}</span>
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span className="trTableSpan">{row.customerWilaya}</span>
      </TableCell>
      <TableCell
        align={language === "ar" ? "right" : "left"}
        className="tableCell"
      >
        <span className="trTableSpan">{row.customerCommune}</span>
      </TableCell>
      <TableCell
        align={language === "ar" ? "right" : "right"}
        className="tableCell w-[100px]"
      >
        <div
          className={`flex items-center ${
            language === "ar" ? "justify-start" : "justify-end"
          }`}
        >
          <EyeIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleViewClick}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    customerId: PropTypes.string.isRequired,
    customerWilaya: PropTypes.string.isRequired,
    customerPhone: PropTypes.string.isRequired,
    customerLastName: PropTypes.string.isRequired,
    customerFirstName: PropTypes.string.isRequired,
    customerCommune: PropTypes.string.isRequired,
  }).isRequired,
  language: PropTypes.string.isRequired,
};

export default function CustomerTable({
  searchQuery,
  setFilteredData,
  data,
  dataLoading,
  language,
}) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data?.length > 0) {
      const rowsData = data.map((data) => ({
        customerFirstName: data.user.firstName,
        customerLastName: data.user.lastName,
        customerId: data.user._id,
        customerPhone: data.user.phoneNumber,
        customerWilaya: data.user.wilaya,
        customerCommune: data.user.commune,
      }));
      setRows(rowsData);
    } else {
      setRows([]);
    }
  }, [data]);

  const filteredRows = rows.filter(
    (row) =>
      row.customerLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerWilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerCommune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setFilteredData(filteredRows);
  }, [filteredRows, setFilteredData]);

  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="collapsible table">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "معرف العميل" : "ID du client"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "الاسم" : "Nom"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span className="thTableSpan">
                {language === "ar" ? "الولاية" : "Wilaya"}
              </span>
            </TableCell>
            <TableCell
              align={language === "ar" ? "right" : "left"}
              className="tableCell"
            >
              <span className="thTableSpan">
                {language === "ar" ? "البلدية" : "Commune"}
              </span>
            </TableCell>
            <TableCell
              align={language === "ar" ? "right" : "right"}
              className="tableCell"
            >
              <span className="thTableSpan">
                {language === "ar" ? "الإجراء" : "Action"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.length > 0 ? (
            [...filteredRows]
              .reverse()
              .map((row) => (
                <Row key={row.customerId} row={row} language={language} />
              ))
          ) : dataLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <span className="thTableSpan">
                  {language === "ar"
                    ? "لم يتم العثور على عملاء"
                    : "Aucun client trouvé"}
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CustomerTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  dataLoading: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
};
