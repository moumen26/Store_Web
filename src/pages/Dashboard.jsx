import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import DashboardTopSellingProduct from "../components/DashboardTopSellingProduct";
import DashboardTopStocksAboutToFinish from "../components/DashboardStocksAboutToFinish";
import DashboadStoreStatistic from "../components/DashboadStoreStatistic";
import DashboardNewCostumers from "../components/DashboardNewCostumers";
import DashboardChart from "../components/DashboardChart";
import DashboardCalendar from "../components/DashboardCalendar";
import { TokenDecoder } from "../util/DecodeToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  //---------------------------------API calls---------------------------------\\

  //fetch data
  const fetchOrdersStats = async () => {
    let response;
    if (dateRange.startDate && dateRange.endDate) {
      response = await fetch(
        `${import.meta.env.VITE_APP_URL_BASE}/Dashboard/orders/stats/${
          decodedToken.id
        }?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
    } else {
      response = await fetch(
        `${import.meta.env.VITE_APP_URL_BASE}/Dashboard/orders/today/${
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
    }

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: OrdersStats,
    error: OrdersStatsError,
    isLoading: OrdersStatsLoading,
    refetch: refetchOrdersStats,
  } = useQuery({
    queryKey: ["OrdersStats", user?.token],
    queryFn: fetchOrdersStats,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  useEffect(() => {
    refetchOrdersStats();
  }, [dateRange]);

  //fetch data
  const fetchTopSellingStocks = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Dashboard/top-selling-products/${
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
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: TopSellingStocks,
    error: TopSellingStocksError,
    isLoading: TopSellingStocksLoading,
    refetch: refetchTopSellingStocks,
  } = useQuery({
    queryKey: ["TopSellingStocks", user?.token],
    queryFn: fetchTopSellingStocks,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  //fetch data
  const fetchStatsData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Dashboard/stats/${decodedToken.id}`,
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
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: StatsData,
    error: StatsDataError,
    isLoading: StatsDataLoading,
    refetch: refetchStatsData,
  } = useQuery({
    queryKey: ["StatsData", user?.token],
    queryFn: fetchStatsData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  //fetch data
  const fetchLastNewAccessCustomers = async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_APP_URL_BASE
      }/Dashboard/last-new-access-customers/${decodedToken.id}`,
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
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: LastNewAccessCustomers,
    error: LastNewAccessCustomersError,
    isLoading: LastNewAccessCustomersLoading,
    refetch: refetchLastNewAccessCustomers,
  } = useQuery({
    queryKey: ["LastNewAccessCustomers", user?.token],
    queryFn: fetchLastNewAccessCustomers,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  //fetch data
  const fetchStocksAboutToFinish = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Dashboard/stocks-about-to-finish/${
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
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: StocksAboutToFinish,
    error: StocksAboutToFinishError,
    isLoading: StocksAboutToFinishLoading,
    refetch: refetchStocksAboutToFinish,
  } = useQuery({
    queryKey: ["StocksAboutToFinish", user?.token],
    queryFn: fetchStocksAboutToFinish,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: false, // Disable refetch on window focus (optional)
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: 1000, // Delay between retries (1 second)
  });

  return (
    <div className="pagesContainer scrollPage">
      <Header />
      <div className="w-full flex items-center justify-between">
        <div className="flex-col space-y-[6px]">
          <h2 className="pagesTitle">Bienvenue, {user?.infos?.firstName}</h2>
          <span className="pagesSousTitle">
            Voici un aperçu de vos ventes actuelles{" "}
          </span>
        </div>
        <DashboardCalendar
          onDateChange={(start, end) =>
            setDateRange({ startDate: start, endDate: end })
          }
        />
      </div>
      <div className="flex items-center space-x-6">
        <DashboardCard
          dashboardCardTitle="Montant total"
          dashboardCardAmount={OrdersStats?.totalAmount}
          OrdersStatsLoading={OrdersStatsLoading}
        />
        <DashboardCard
          dashboardCardTitle="Total des commandes"
          dashboardCardAmount={OrdersStats?.totalReceipts}
          OrdersStatsLoading={OrdersStatsLoading}
        />
        <DashboardCard
          dashboardCardTitle="Profit"
          dashboardCardAmount={OrdersStats?.totalProfit}
          OrdersStatsLoading={OrdersStatsLoading}
        />
      </div>
      <div className="flex items-center justify-between space-x-6">
        <DashboardChart />
        <DashboardTopSellingProduct
          TopSellingStocks={TopSellingStocks}
          TopSellingStocksLoading={TopSellingStocksLoading}
        />
      </div>
      <div className="w-full flex justify-between space-x-6">
        <DashboadStoreStatistic
          StatsData={StatsData}
          StatsDataLoading={StatsDataLoading}
        />
        <DashboardTopStocksAboutToFinish
          StocksAboutToFinish={StocksAboutToFinish}
          StocksAboutToFinishLoading={StocksAboutToFinishLoading}
        />
        <DashboardNewCostumers
          LastNewAccessCustomers={LastNewAccessCustomers}
          LastNewAccessCustomersLoading={LastNewAccessCustomersLoading}
        />
      </div>
    </div>
  );
}
