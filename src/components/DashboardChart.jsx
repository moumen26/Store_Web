import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";

export default function DashboardChart({ language }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [selectedOption, setSelectedOption] = useState("daily");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Utility function to fetch data
  const fetchData = async (endpoint) => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Dashboard/${endpoint}/${
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
        throw new Error(`Error receiving data for ${endpoint}`);
      }
    }

    return await response.json(); // Return the data if the response is successful
  };

  // useQuery hook to fetch data dynamically
  const {
    data: chartApiData,
    error: chartApiError,
    isLoading: chartApiLoading,
  } = useQuery({
    queryKey: ["chartData", selectedOption, user?.token],
    queryFn: () => fetchData(`total-profit-${selectedOption}`),
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  // Update chart data based on the selected option and API response
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const getLabels = () => {
      if (!chartApiData || chartApiData.length === 0) return [];

      // Extract labels from the API response
      return chartApiData.map((item) => item._id);
    };

    const getDatasets = () => {
      if (!chartApiData) return [];

      return [
        {
          label: "Revenue",
          data: chartApiData.map((item) => item.totalProfit),
          fill: true,
          borderColor: documentStyle.getPropertyValue("--mainColor"),
          tension: 0.4,
        },
      ];
    };

    const getOptions = () => {
      return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: () => "",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
    };

    setChartData({
      labels: getLabels(),
      datasets: getDatasets(),
    });
    setChartOptions(getOptions());
  }, [selectedOption, chartApiData]);

  // Handle loading and error states
  if (chartApiLoading) {
    return (
      <div className="dashboadChart">
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #E5E7EB",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
      }}
      className={`dashboadChart ${language === "ar" ? "rtl" : ""}`}
    >
      <div className="w-full dashboadChartTop">
        <h3
          className="dashboardTitleItem w-fit"
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
        >
          {language === "fr"
            ? "Ventes au fil du temps"
            : "المبيعات على مر الزمن"}
        </h3>
        <div
          className={`selectTime ${
            language === "ar" ? "space-x-reverse space-x-8" : "space-x-8"
          }`}
        >
          <div
            className={`flex items-center ${
              language === "ar" ? "space-x-reverse space-x-4" : "space-x-4"
            }`}
          >
            <div
              className={`flex items-center ${
                language === "ar" ? "space-x-reverse space-x-1" : "space-x-1"
              }`}
            >
              <div className="cercleChartItemRevenue"></div>
              <span
                className="spanChartItemRevenue"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "fr"
                  ? "Montant total (DA)"
                  : "المبلغ الإجمالي (دج)"}
              </span>
            </div>
          </div>
          <div className="selectOptionChartClass">
            <select
              className="selectOptionChart"
              name="selectOptionChart"
              id="selectOptionChart"
              value={selectedOption}
              onChange={handleChange}
            >
              <option
                value="weekly"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "fr" ? "Semaine" : "أسبوع"}
              </option>
              <option
                value="monthly"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "fr" ? "Mois" : "شهر"}
              </option>
              <option
                value="yearly"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "fr" ? "Année" : "سنة"}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <Chart
          type="line"
          data={chartData}
          options={chartOptions}
          height="420px"
        />
      </div>
    </div>
  );
}
