import PropTypes from "prop-types";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { CircularProgress } from "@mui/material";
import { formatDate } from "../util/useFullFunctions";

function ProductHistoriqueRow({ historique }) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{formatDate(historique.date)}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{historique.buying} DA</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{historique.selling} DA</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{historique.quantity}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">
          {historique.exparationDate ? historique.exparationDate : "undefined"}
        </span>
      </TableCell>
    </TableRow>
  );
}

ProductHistoriqueRow.propTypes = {
  historique: PropTypes.object.isRequired,
};

// Main component
export default function ProductArchiveHistorique({ selectedStockId }) {
  const { user } = useAuthContext();

  //---------------------------------API calls---------------------------------\\

  // fetching specific Stock status data
  const fetchEndedStockStatusById = async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_APP_URL_BASE
      }/StockStatus/ended/${selectedStockId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    // Handle the error state
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      } else {
        throw new Error(
          "Error receiving Stock Status data: " + response.statusText
        );
      }
    }

    // Return the fetched product data
    return await response.json();
  };
  // useQuery hook to fetch data for a specific EndedStockStatus
  const {
    data: EndedStockStatusData,
    error: EndedStockStatusError,
    isLoading: EndedStockStatusLoading,
    refetch: EndedStockStatusRefetch,
  } = useQuery({
    queryKey: ["EndedStockStatusData", selectedStockId, user?.token],
    queryFn: () => fetchEndedStockStatusById(), // Call the fetch function with selectedStockId
    enabled: !!selectedStockId && !!user?.token, // Ensure the query runs only if the product ID and token are available
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });
  return (
    <TableContainer component={Paper} style={{ boxShadow: "none" }}>
      <Table aria-label="product historique">
        <TableHead>
          <TableRow>
            <TableCell>
              <span className="thTableSpan">Date</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Buying Price</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Selling Price</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Quantity</span>
            </TableCell>
            <TableCell>
              <span className="thTableSpan">Exparation Date </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {EndedStockStatusLoading ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : !EndedStockStatusData || EndedStockStatusData.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No Data Available
              </TableCell>
            </TableRow>
          ) : (
            EndedStockStatusData?.map((historique) => (
              <ProductHistoriqueRow
                key={historique._id}
                historique={historique}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
