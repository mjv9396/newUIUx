/* eslint-disable react/prop-types */
const Error = ({ error }) => {
  return (
    <p className="text-center">
      {error.status === 401 && (
        <small className="text-danger">
          You are authorized to assess this page. Please login again or contact
          support for help
        </small>
      )}
    </p>
  );
};

export default Error;
