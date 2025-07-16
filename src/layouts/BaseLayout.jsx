/* eslint-disable react/prop-types */
import { Helmet, HelmetProvider } from "react-helmet-async";

const BaseLayout = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title></title>
        <meta name="" content="" />
      </Helmet>
      {children}
    </HelmetProvider>
  );
};

export default BaseLayout;
