import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// Initialize GA4 in production
if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("G-34NF6VJYND"); 
}

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
};

export const GA4PageTracker = () => {
  usePageTracking();
  return null;
};
