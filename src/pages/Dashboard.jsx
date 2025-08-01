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
import { EqualsIcon } from "@heroicons/react/16/solid";
import { formatNumber } from "../util/useFullFunctions";

export default function Dashboard({
  onToggle,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  language,
  toggleLanguage,
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  // Function to get time-based greeting
  const getTimeBasedGreeting = (language) => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      // Morning: 5:00 - 11:59
      return language === "ar" ? "صباح الخير" : "Bonjour";
    } else if (hour >= 12 && hour < 18) {
      // Afternoon: 12:00 - 17:59
      return language === "ar" ? "مساء الخير" : "Bon après-midi";
    } else {
      // Evening/Night: 18:00 - 4:59
      return language === "ar" ? "مساء الخير" : "Bonsoir";
    }
  };

  const text = {
    fr: {
      title: "Tableau de bord",
      welcome: getTimeBasedGreeting(language),
      overview: "Voici un aperçu de vos ventes actuelles",
      totalAmount: "Montant total des commandes",
      totalOrders: "Total des commandes",
      profit: "Profit",
    },
    ar: {
      title: "لوحة القيادة",
      welcome: getTimeBasedGreeting(language),
      overview: "إليك نظرة عامة على مبيعاتك الحالية",
      totalAmount: "المبلغ الإجمالي للطلبيات",
      totalOrders: "عدد الطلببات",
      profit: "الربح",
    },
  };

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
    <div
      className="pagesContainer scrollPage"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="flexHeader">
        <div onClick={onToggle} className="equalsIcon">
          <EqualsIcon className="iconAsideBarClose" />
        </div>
        <Header toggleLanguage={toggleLanguage} language={language} />
      </div>
      <div className="w-full dashboardTop">
        <div className="flex-col space-y-[6px]">
          <h2
            className="pagesTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {text[language].welcome}, {user?.infos?.firstName}
          </h2>
          <span
            className="pagesSousTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {text[language].overview}
          </span>
        </div>
        <DashboardCalendar
          onDateChange={(start, end) =>
            setDateRange({ startDate: start, endDate: end })
          }
          language={language}
        />
      </div>
      <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible hide-scrollbar">
        <DashboardCard
          dashboardCardTitle={text[language].totalAmount}
          dashboardCardAmount={formatNumber(OrdersStats?.totalAmount)}
          OrdersStatsLoading={OrdersStatsLoading}
          language={language}
          className="flex-shrink-0 w-[280px] md:w-full"
        />
        <DashboardCard
          dashboardCardTitle={text[language].totalOrders}
          dashboardCardAmount={OrdersStats?.totalReceipts}
          language={language}
          OrdersStatsLoading={OrdersStatsLoading}
          className="flex-shrink-0 w-[280px] md:w-full"
        />
        <DashboardCard
          dashboardCardTitle={text[language].profit}
          dashboardCardAmount={formatNumber(OrdersStats?.totalProfit)}
          language={language}
          OrdersStatsLoading={OrdersStatsLoading}
          className="flex-shrink-0 w-[280px] md:w-full"
        />
      </div>
      <div className="dashbordFlex">
        <DashboardChart language={language} />
        <DashboardTopSellingProduct
          TopSellingStocks={TopSellingStocks}
          TopSellingStocksLoading={TopSellingStocksLoading}
          language={language}
        />
      </div>
      <div className="dashbordFlex dashboardFlexBottom">
        <DashboadStoreStatistic
          StatsData={StatsData}
          StatsDataLoading={StatsDataLoading}
          language={language}
        />
        <DashboardTopStocksAboutToFinish
          StocksAboutToFinish={StocksAboutToFinish}
          StocksAboutToFinishLoading={StocksAboutToFinishLoading}
          language={language}
        />
        <DashboardNewCostumers
          LastNewAccessCustomers={LastNewAccessCustomers}
          LastNewAccessCustomersLoading={LastNewAccessCustomersLoading}
          language={language}
        />
      </div>
    </div>
  );
}
