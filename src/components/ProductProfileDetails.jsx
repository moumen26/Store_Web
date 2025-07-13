import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function ProductProfileRow({ data, language }) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span
          className="trTableSpan"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {data?.product?._id}
        </span>
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span
          className="trTableSpan"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {data?.product?.name} {" "}
          {data?.product?.brand.name}
        </span>
      </TableCell>
      {/* <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span
          className="trTableSpan"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {data?.product?.brand.name}
        </span>
      </TableCell> */}
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span
          className="trTableSpan"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {data?.product?.boxItems}
        </span>
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span
          className="trTableSpan"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {data?.quantity}
        </span>
      </TableCell>
      <TableCell
        className="tableCell"
        align={language === "ar" ? "right" : "left"}
      >
        <span
          className="trTableSpan"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {Math.floor((data?.quantity || 0) / (data?.product?.boxItems || 1))}{" "}
          boîtes and {(data?.quantity || 0) % (data?.product?.boxItems || 1)}{" "}
          unités
        </span>
      </TableCell>
    </TableRow>
  );
}

export default function ProductProfileDetails({ data, language }) {
  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="product profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "رمز المنتج" : "Code Produit"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? " التعيين" : "Designation"}
              </span>
            </TableCell>
            {/* <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "ماركة" : "Marque"}
              </span>
            </TableCell> */}
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "الوحدة في العلبة" : "Unité par box"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "كمية المخزون" : "Quantité de stock"}
              </span>
            </TableCell>
            <TableCell
              className="tableCell"
              align={language === "ar" ? "right" : "left"}
            >
              <span
                className="thTableSpan"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "كمية المنتج بالوحدة والعلبة" : "Quantité box et unité"}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ProductProfileRow data={data} language={language} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
