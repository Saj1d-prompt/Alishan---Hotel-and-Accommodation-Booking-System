import {
  useEffect,
} from "react";

import {
  useLocation,
} from "react-router-dom";

const ScrollToTop = () => {
  const {
    pathname,
    search,
    hash,
  } = useLocation();

  /*
   * Prevent the browser from restoring an old
   * scroll position when navigating through
   * the React application.
   */
  useEffect(() => {
    if (
      !(
        "scrollRestoration"
        in window.history
      )
    ) {
      return undefined;
    }

    const previousValue =
      window.history
        .scrollRestoration;

    window.history
      .scrollRestoration =
      "manual";

    return () => {
      window.history
        .scrollRestoration =
        previousValue;
    };
  }, []);

  useEffect(() => {
    /*
     * Keep intentional anchor navigation working.
     *
     * Example:
     * /locations/pylimo#room-types
     */
    if (hash) {
      const elementId =
        decodeURIComponent(
          hash.substring(1),
        );

      window.requestAnimationFrame(
        () => {
          const element =
            document.getElementById(
              elementId,
            );

          if (element) {
            element.scrollIntoView({
              behavior: "auto",
              block: "start",
            });
          }
        },
      );

      return;
    }

    /*
     * Normal page navigation should always
     * begin at the top.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [
    pathname,
    search,
    hash,
  ]);

  return null;
};

export default ScrollToTop;