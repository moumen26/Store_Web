import React, { Fragment, useEffect, useState } from "react";
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
import ConfirmDialog from "./ConfirmDialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";

function Row(props) {
  const { row, handleConfirmAlert, language } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleViewClick = () => {
    navigate(`/NAPCustomerProfile/${row.userId}`);
  };

  const handleInactiveClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL_BASE}/MyStores/approve/${row.storeID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${row?.token}`,
          },
          body: JSON.stringify({
            user: row.userId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOpen(false);
        handleConfirmAlert(`${data.message}`);
      }
      if (!response.ok) {
        const data = await response.json();
        setOpen(false);
        handleConfirmAlert(`${data.message}`);
      }
    } catch (error) {
      console.error("Error activating user to access store:", error);
    }
  };

  return (
    <Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
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
            <span
              className="mr-1 trTableSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {row.userFirstName}
            </span>
            <span
              className="trTableSpan"
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {row.userLastName}
            </span>
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
            {row.userPhone}
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
            {row.userWilaya}
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
            {row.userCommune}
          </span>
        </TableCell>
        <TableCell
          className="tableCell"
          align={language === "ar" ? "right" : "left"}
        >
          <div
            className={`activeClass ${
              row.status === "pending" ? "border border-yellow-600" : ""
            }`}
            onClick={handleInactiveClick}
          >
            <div className="cercleActive"></div>
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className={`inactiveSpan trTableSpan ${
                row.status === "pending" ? "text-yellow-600" : ""
              }`}
            >
              {language === "ar"
                ? row.status === "pending"
                  ? "قيد الانتظار"
                  : row.status === "active"
                  ? "نشط"
                  : "غير نشط"
                : row.status === "pending"
                ? "En attente"
                : row.status === "active"
                ? "Actif"
                : "Inactif"}
            </span>
          </div>
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

      <ConfirmDialog
        open={open}
        language={language}
        onClose={handleClose}
        onConfirm={handleConfirm}
        dialogTitle={
          language === "ar"
            ? "تأكيد تفعيل المستخدم"
            : "Confirmation de l’activation de l’utilisateur"
        }
        dialogContentText={
          language === "ar"
            ? "هل أنت متأكد أنك تريد تفعيل هذا المستخدم؟"
            : "Êtes-vous sûr de vouloir activer cet utilisateur ?"
        }
      />
    </Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userWilaya: PropTypes.string.isRequired,
    userPhone: PropTypes.string.isRequired,
    userFirstName: PropTypes.string.isRequired,
    userLastName: PropTypes.string.isRequired,
    userCommune: PropTypes.string.isRequired,
    userAddress: PropTypes.array.isRequired,
    status: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    storeID: PropTypes.string.isRequired,
  }).isRequired,
  handleConfirmAlert: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

export default function AuthenticationTable({
  searchQuery,
  setFilteredData,
  language,
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();

  //fetch data
  const fetchNotApprovedUsersData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/MyStores/notApprovedUsers/${
        decodedToken.id
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error(
          "Error receiving not approved users data for this store"
        );
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: NotApprovedUsersData,
    error: notApprovedUsersError,
    isLoading: notApprovedUsersLoading,
    refetch: refetchNotApprovedUsersData,
  } = useQuery({
    queryKey: ["NotApprovedUsersData", user?.token],
    queryFn: fetchNotApprovedUsersData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });
  // Refetch data when user changes
  const handleRefetchDataChange = () => {
    refetchNotApprovedUsersData();
  };

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (NotApprovedUsersData?.length > 0) {
      const rowsData = NotApprovedUsersData?.map((data) => {
        return {
          userFirstName: data?.user?.firstName,
          userLastName: data?.user?.lastName,
          userId: data?.user?._id,
          userPhone: data?.user?.phoneNumber,
          userWilaya: data?.user?.wilaya,
          userCommune: data?.user?.commune,
          userAddress: data?.user?.storeAddresses,
          status: data?.status,
          token: user?.token,
          storeID: decodedToken.id,
        };
      });
      setRows(rowsData);
    } else {
      setRows([]);
    }
  }, [NotApprovedUsersData, decodedToken.id]);

  const filteredRows = rows.filter(
    (row) =>
      row.userFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userWilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userCommune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleConfirmAlert = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    handleRefetchDataChange();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    setFilteredData(filteredRows);
  }, [filteredRows, setFilteredData]);
  return (
    <Fragment>
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
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
                  {language === "ar" ? "الاسم الكامل" : "Nom complet"}
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
                  {language === "ar" ? "رقم الهاتف" : "Numéro de téléphone"}
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
                  {language === "ar" ? "الولاية" : "Wilaya"}
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
                  {language === "ar" ? "البلدية" : "Commune"}
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
                  {language === "ar" ? "الحالة" : "Statut"}
                </span>
              </TableCell>
              <TableCell
                align={language === "ar" ? "right" : "right"}
                className="tableCell"
              >
                <span
                  className="thTableSpan"
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                >
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
                  <Row
                    key={row.userId}
                    row={row}
                    handleConfirmAlert={handleConfirmAlert}
                    language={language}
                  />
                ))
            ) : notApprovedUsersLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {/* <span className="thTableSpan"
                   style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
                  >loading...</span> */}
                  <CircularProgress color="inherit" />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <span
                    className="thTableSpan"
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "ar"
                      ? "لم يتم العثور على مستخدمين"
                      : "Aucun utilisateur trouvé"}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

AuthenticationTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
